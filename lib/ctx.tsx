'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sb } from './supabase';

export const PERMS: [string, string][] = [
  ['view_chanda', 'चंदा देखना'], ['add_chanda', 'चंदा जोड़ना'],
  ['view_kharch', 'खर्च देखना'], ['add_kharch', 'खर्च जोड़ना'],
  ['cancel_entry', 'एंट्री रद्द करना'], ['view_audit', 'रिकॉर्ड देखना'],
];
export const CATS = ['पंडाल', 'मूर्ति', 'भोग/प्रसाद', 'लाइट/सजावट', 'पुजारी/दक्षिणा', 'साउंड/डीजे', 'विसर्जन', 'अन्य'];
export const rs = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');
export const today = () => new Date().toISOString().slice(0, 10);
const sum = (a: any[]) => a.reduce((s, x) => s + Number(x.amount), 0);
const group = (a: any[], k: string) => {
  const m: any = {}; a.forEach(x => (m[x[k] || 'नहीं लिखा'] = (m[x[k] || 'नहीं लिखा'] || 0) + Number(x.amount)));
  return Object.entries(m).sort((p: any, q: any) => q[1] - p[1]) as [string, number][];
};
export function csv(rows: any[], name: string) {
  if (!rows.length) return alert('एक्सपोर्ट करने के लिए कोई एंट्री नहीं है');
  const h = Object.keys(rows[0]);
  const c = (v: any) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const t = '\ufeff' + [h.join(',')].concat(rows.map(r => h.map(k => c(r[k])).join(','))).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([t], { type: 'text/csv' })); a.download = name; a.click();
}

export const Ctx = createContext<any>(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('dash');
  const [year, setYear] = useState(new Date().getFullYear());
  const [ch, setCh] = useState<any[]>([]);
  const [kh, setKh] = useState<any[]>([]);
  const [au, setAu] = useState<any[]>([]);
  const [us, setUs] = useState<any[]>([]);
  const [err, setErr] = useState('');
  const [cfg, setCfg] = useState<any>({});
  const can = (p: string) => me?.role === 'superadmin' || me?.perms?.includes(p);

  const loadMe = useCallback(async () => {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { setMe(null); setReady(true); return; }
    const { data } = await sb.from('kpl_profiles').select('*').eq('id', session.user.id).single();
    if (!data?.active) { await sb.auth.signOut(); setMe(null); } else setMe(data);
    setReady(true);
  }, []);
  useEffect(() => { loadMe(); if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {}); }, [loadMe]);

  const loadCfg = useCallback(async () => {
    const { data } = await sb.from('kpl_settings').select('*'); const o: any = {};
    (data || []).forEach((r: any) => (o[r.key] = r.value)); setCfg(o);
  }, []);
  useEffect(() => { loadCfg(); }, [loadCfg]);

  const load = useCallback(async () => {
    if (!me) return;
    const q = (t: string) => sb.from(t).select('*').eq('year', year).order('id', { ascending: false });
    if (can('view_chanda')) setCh((await q('kpl_chanda')).data || []);
    if (can('view_kharch')) setKh((await q('kpl_kharch')).data || []);
    if (can('view_audit')) setAu((await sb.from('kpl_audit').select('*').order('id', { ascending: false }).limit(200)).data || []);
    if (me.role === 'superadmin') setUs((await sb.from('kpl_profiles').select('*').order('created_at')).data || []);
  }, [me, year]);
  useEffect(() => { load(); }, [load]);

  async function login(e: any) {
    e.preventDefault(); setErr('');
    const f = new FormData(e.target);
    const { error } = await sb.auth.signInWithPassword({ email: `${String(f.get('u')).trim().toLowerCase()}@kpl.local`, password: String(f.get('p')) });
    if (error) return setErr('यूज़रनेम या पासवर्ड गलत है');
    loadMe();
  }
  const logout = async () => { await sb.auth.signOut(); setMe(null); setCh([]); setKh([]); setAu([]); setUs([]); };

  async function addCh(e: any) {
    e.preventDefault(); const f = new FormData(e.target); const form = e.target;
    const { error } = await sb.from('kpl_chanda').insert({
      year, donor: String(f.get('donor')).trim(), village: String(f.get('village')).trim(), phone: f.get('phone') || null, amount: Number(f.get('amount')),
      paid_on: f.get('paid_on'), mode: f.get('mode'), collector: String(f.get('collector')).trim(), note: f.get('note') || null,
    });
    if (error) return alert(error.message);
    form.reset(); load();
  }
  async function addKh(e: any) {
    e.preventDefault(); const f = new FormData(e.target); const form = e.target;
    let path: string | null = null; const file = f.get('bill') as File;
    if (file && file.size) {
      path = `${Date.now()}-${file.name.replace(/[^\w.]/g, '_')}`;
      const u = await sb.storage.from('kpl-bills').upload(path, file);
      if (u.error) return alert('बिल अपलोड नहीं हुआ: ' + u.error.message);
    }
    const { error } = await sb.from('kpl_kharch').insert({
      year, category: f.get('category'), item: String(f.get('item')).trim(), amount: Number(f.get('amount')), paid_on: f.get('paid_on'),
      paid_to: String(f.get('paid_to')).trim(), bill_no: f.get('bill_no') || null, bill_path: path, spent_by: String(f.get('spent_by')).trim(),
    });
    if (error) return alert(error.message);
    form.reset(); load();
  }
  async function cancel(t: 'chanda' | 'kharch', id: number) {
    const r = prompt('रद्द करने का कारण लिखें (कम से कम 5 अक्षर):'); if (!r) return;
    const { error } = await sb.rpc('kpl_cancel', { t, rid: id, reason: r });
    if (error) alert(error.message); load();
  }
  async function openBill(p: string) {
    const { data } = await sb.storage.from('kpl-bills').createSignedUrl(p, 120);
    if (data?.signedUrl) window.open(data.signedUrl);
  }
  async function api(body: any) {
    const { data: { session } } = await sb.auth.getSession();
    const r = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session!.access_token }, body: JSON.stringify(body) });
    const j = await r.json(); if (!r.ok) throw new Error(j.error); return j;
  }
  async function addUser(e: any) {
    e.preventDefault(); const f = new FormData(e.target); const form = e.target;
    try {
      await api({ action: 'create', username: f.get('username'), password: f.get('password'), full_name: f.get('full_name'), perms: f.getAll('perm') });
      form.reset(); load();
    } catch (x: any) { alert(x.message); }
  }
  async function upd(id: string, body: any) { try { await api({ action: 'update', id, ...body }); load(); } catch (x: any) { alert(x.message); } }

  async function saveCfg(e: any) {
    e.preventDefault(); const f = new FormData(e.target);
    const rows = ['name', 'tagline', 'dates', 'address'].map(k => ({ key: k, value: String(f.get(k) || '').trim() }));
    const { error } = await sb.from('kpl_settings').upsert(rows);
    if (error) return alert(error.message); alert('सेव हो गया'); loadCfg();
  }
  async function upPhoto(blob: Blob, prefix: string) {
    const path = `${prefix}-${Date.now()}.${blob.type === 'image/png' ? 'png' : 'jpg'}`;
    const u = await sb.storage.from('kpl-brand').upload(path, blob, { contentType: blob.type });
    if (u.error) { alert(u.error.message); return null; }
    return sb.storage.from('kpl-brand').getPublicUrl(path).data.publicUrl as string;
  }
  async function upImg(key: 'logo' | 'durga', blob: Blob) {
    const url = await upPhoto(blob, key); if (!url) return;
    const { error } = await sb.from('kpl_settings').upsert({ key, value: url });
    if (error) return alert(error.message); loadCfg();
  }

  if (!ready) return <div className="empty">खुल रहा है…</div>;
  if (!me) return (
    <form className="login" style={{ display: 'block' }} onSubmit={login}>
      {cfg.logo && <img src={cfg.logo} alt="" className="logo" />}
      <h1>{cfg.name || 'KPL'}</h1>
      <p style={{ color: 'var(--mut)', marginTop: 0 }}>{cfg.tagline || 'दुर्गा पूजा का पूरा हिसाब'}</p>
      <label className="f">यूज़रनेम</label><input name="u" required autoCapitalize="none" autoComplete="username" />
      <label className="f" style={{ marginTop: 10 }}>पासवर्ड</label><input name="p" type="password" required autoComplete="current-password" />
      {err && <div className="err">{err}</div>}
      <button className="b" style={{ width: '100%', marginTop: 14 }}>लॉगिन करें</button>
    </form>
  );

  const ach = ch.filter(x => x.status === 'active'), akh = kh.filter(x => x.status === 'active');
  const tin = sum(ach), tout = sum(akh), bal = tin - tout;
  const todayIn = sum(ach.filter(x => x.paid_on === today()));
  const catRows = group(akh, 'category'), colRows = group(ach, 'collector'), vilRows = group(ach, 'village');
  const menu = ([['/hisaab', '📊', 'हिसाब', can('view_chanda') || can('view_kharch')], ['/chanda', '💰', 'चंदा', can('view_chanda')],
    ['/kharch', '🧾', 'खर्च', can('view_kharch')], ['/record', '📜', 'रिकॉर्ड', can('view_audit')],
    ['/members', '🧑‍🤝‍🧑', 'समिति के सदस्य', me.role === 'superadmin'], ['/users', '👥', 'यूज़र', me.role === 'superadmin'],
    ['/settings', '⚙️', 'सेटिंग', me.role === 'superadmin']] as [string, string, string, boolean][]).filter(x => x[3]);
  const wa = (x: any) => {
    const d = String(x.paid_on).split('-').reverse().join('/');
    const msg = ['🙏 जय माँ दुर्गा 🙏', '', `आदरणीय ${x.donor} जी${x.village ? ' (' + x.village + ')' : ''},`, '',
      `${cfg.name || 'दुर्गा पूजा समिति'} के लिए आपका ${rs(x.amount)} का चंदा हमें प्राप्त हुआ।`, '',
      `📄 रसीद नंबर: ${x.id}`, `📅 तारीख: ${d}`, `💳 भुगतान: ${x.mode}`, `✍️ प्राप्तकर्ता: ${x.collector}`, '',
      'माँ दुर्गा आपके और आपके परिवार पर अपनी कृपा बनाए रखें।', 'आपके सहयोग के लिए हृदय से धन्यवाद। 🙏', '',
      `— ${cfg.name || 'दुर्गा पूजा समिति'}`].concat(cfg.tagline ? [cfg.tagline] : []).join('\n');
    return `https://wa.me/91${String(x.phone).replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(msg)}`;
  };

  const value = { bal, me, cfg, year, setYear, ch, kh, au, us, can, ach, akh, tin, tout, todayIn, catRows, colRows, vilRows, wa, menu, logout, addCh, addKh, cancel, openBill, addUser, upd, saveCfg, upImg, upPhoto, load, loadCfg };
  return <Ctx.Provider value={value}><Shell>{children}</Shell></Ctx.Provider>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const { cfg, year, setYear, menu, me, logout } = useApp();
  const path = usePathname() || '';
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);
  return (<>
    <div className="band"><div className="row">
      <Link href="/" className="brand">{cfg.logo && <img src={cfg.logo} alt="" className="logo sm" />}<b>{cfg.name || 'KPL'}</b></Link>
      <span className="rt">
        {['/hisaab', '/chanda', '/kharch'].includes(path) && <select value={year} onChange={e => setYear(+e.target.value)} aria-label="साल">{[0, 1, 2, 3, 4].map(i => <option key={i}>{new Date().getFullYear() + 1 - i}</option>)}</select>}
        <button className="mg" onClick={() => setOpen(true)} aria-label="मैनेज"><svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><rect x="2" y="2" width="7" height="7" rx="1.5" /><rect x="11" y="2" width="7" height="7" rx="1.5" /><rect x="2" y="11" width="7" height="7" rx="1.5" /><rect x="11" y="11" width="7" height="7" rx="1.5" /></svg>मैनेज</button>
      </span>
    </div></div>
    <div className={'ov' + (open ? ' on' : '')} onClick={() => setOpen(false)} />
    <aside className={'drawer' + (open ? ' on' : '')} aria-hidden={!open}>
      <div className="dh"><b>मैनेज</b><button className="g" onClick={() => setOpen(false)} aria-label="बंद करें">✕</button></div>
      <nav>{([['/', '🏠', 'होम']] as any[]).concat(menu).map(([h, i, l]: any) => <Link key={h} href={h} className={'dl' + (path === h ? ' cur' : '')}><span>{i}</span>{l}</Link>)}</nav>
      <div className="df"><div><b>{me.full_name}</b><small style={{ display: 'block', color: 'var(--mut)' }}>@{me.username}</small></div><button className="g" onClick={logout}>लॉगआउट</button></div>
    </aside>
    <div className="wrap">{children}</div>
  </>);
}
