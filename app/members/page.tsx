'use client';
import { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../lib/ctx';
import Crop from '../../lib/Crop';
import { sb } from '../../lib/supabase';

export default function Members() {
  const { me, upPhoto } = useApp();
  const [list, setList] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [prev, setPrev] = useState('');
  const load = useCallback(async () => setList((await sb.from('kpl_members').select('*').order('sort').order('id')).data || []), []);
  useEffect(() => { load(); }, [load]);
  if (me.role !== 'superadmin') return <div className="empty">यह पेज सिर्फ़ सुपरएडमिन के लिए है</div>;

  async function add(e: any) {
    e.preventDefault(); const f = new FormData(e.target); const form = e.target;
    const photo = blob ? await upPhoto(blob, 'member') : null;
    if (blob && !photo) return;
    const { error } = await sb.from('kpl_members').insert({ name: String(f.get('name')).trim(), role: String(f.get('role') || '').trim() || null, sort: Number(f.get('sort') || 0), photo });
    if (error) return alert(error.message);
    form.reset(); setBlob(null); setPrev(''); load();
  }
  async function del(m: any) {
    if (!confirm(`${m.name} को समिति से हटा दें?`)) return;
    const { error } = await sb.from('kpl_members').delete().eq('id', m.id);
    if (error) alert(error.message); load();
  }
  return (<>
    <h2 style={{ marginTop: 0 }}>नया सदस्य जोड़ें</h2>
    <form onSubmit={add}>
      <input name="name" placeholder="नाम" required />
      <input name="role" list="roles" placeholder="पद (जैसे अध्यक्ष)" />
      <datalist id="roles"><option>संरक्षक</option><option>अध्यक्ष</option><option>उपाध्यक्ष</option><option>सचिव</option><option>कोषाध्यक्ष</option><option>सदस्य</option></datalist>
      <input name="sort" type="number" placeholder="क्रम (1, 2, 3…)" />
      <label className="pick">
        <input type="file" accept="image/*" hidden onChange={e => { setFile(e.target.files?.[0] || null); e.target.value = ''; }} />
        {prev ? <img className="logo sm" src={prev} alt="" /> : '📷'} {prev ? 'फ़ोटो बदलें' : 'फ़ोटो चुनें'}
      </label>
      <button className="b full">सदस्य जोड़ें</button>
    </form>
    {file && <Crop file={file} aspect={1} circle outW={480} type="image/jpeg" onCancel={() => setFile(null)} onDone={(b: Blob) => { setBlob(b); setPrev(URL.createObjectURL(b)); setFile(null); }} />}
    <h2>सभी सदस्य ({list.length})</h2>
    {list.map(m => (
      <div key={m.id} className="item" style={{ alignItems: 'center' }}>
        <span className="brand" style={{ color: 'var(--ink)' }}>{m.photo ? <img className="logo sm" src={m.photo} alt="" style={{ width: 48, height: 48 }} /> : <span className="logo sm" style={{ width: 48, height: 48 }} />}
          <span><b>{m.name}</b><small>{m.role || '—'} · क्रम {m.sort}</small></span></span>
        <button className="g danger" onClick={() => del(m)}>हटाएँ</button>
      </div>))}
    {!list.length && <div className="empty">अभी कोई सदस्य नहीं जोड़ा गया</div>}
  </>);
}
