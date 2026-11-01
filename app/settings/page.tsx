'use client';
import { useState } from 'react';
import { useApp, rs, csv, PERMS, CATS, today, Head } from '../../lib/ctx';
import Crop from '../../lib/Crop';

export default function Page() {
  const { t, bal, me, cfg, year, ch, kh, au, us, can, ach, akh, tin, tout, todayIn, catRows, colRows, vilRows, wa, addCh, addKh, cancel, openBill, addUser, upd, saveCfg, upImg, load } = useApp();
  const [pk, setPk] = useState<any>(null);
  const pick = (key: string, file?: File | null) => { if (file) setPk({ key, file }); };
  return <><Head icon="⚙️" title={t('सेटिंग')} sub={t('समिति का नाम, लोगो और फ़ोटो')} />{me.role === 'superadmin' && (<>
        <h2 style={{ marginTop: 0 }}>{t('समिति की जानकारी')}</h2>
        <form onSubmit={saveCfg} key={JSON.stringify(cfg)}>
          <input className="full" name="name" placeholder={t('समिति का नाम')} defaultValue={cfg.name || ''} required />
          <input className="full" name="tagline" placeholder={t('टैगलाइन (जैसे: जय माँ दुर्गा)')} defaultValue={cfg.tagline || ''} />
          <input name="dates" placeholder={t('पूजा की तारीख')} defaultValue={cfg.dates || ''} />
          <input name="address" placeholder={t('गाँव / पता')} defaultValue={cfg.address || ''} />
          <button className="b full">{t('सेव करें')}</button>
        </form>
        <h2>{t('फ़ोटो')}</h2>
        <div className="item" style={{ display: 'block' }}><label className="f">{t('समिति का लोगो (गोल दिखेगा)')}</label>{cfg.logo && <img src={cfg.logo} alt="" className="logo" style={{ marginBottom: 8 }} />}<input type="file" accept="image/*" onChange={e => pick('logo', e.target.files?.[0])} /></div>
        <div className="item" style={{ display: 'block' }}><label className="f">{t('दुर्गा जी की फ़ोटो (होम पेज के ऊपर)')}</label>{cfg.durga && <img src={cfg.durga} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />}<input type="file" accept="image/*" onChange={e => pick('durga', e.target.files?.[0])} /></div>
      </>)}{pk && <Crop file={pk.file} aspect={pk.key === 'logo' ? 1 : 16 / 10} circle={pk.key === 'logo'} outW={pk.key === 'logo' ? 512 : 1280} type={pk.key === 'logo' ? 'image/png' : 'image/jpeg'} onCancel={() => setPk(null)} onDone={async (b: Blob) => { await upImg(pk.key, b); setPk(null); }} />}</>;
}
