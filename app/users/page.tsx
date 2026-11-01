'use client';
import { useState } from 'react';
import { useApp, rs, csv, PERMS, CATS, today, Head } from '../../lib/ctx';
import Crop from '../../lib/Crop';

export default function Page() {
  const { t, bal, me, cfg, year, ch, kh, au, us, can, ach, akh, tin, tout, todayIn, catRows, colRows, vilRows, wa, addCh, addKh, cancel, openBill, addUser, upd, saveCfg, upImg, load } = useApp();
  
  return <><Head icon="👥" title={t('यूज़र')} sub={t('कौन क्या कर सकता है, यहाँ तय करें')} />{me.role === 'superadmin' && (<>
        <h2 style={{ marginTop: 0 }}>{t('नया यूज़र बनाएँ')}</h2>
        <form onSubmit={addUser}>
          <input name="full_name" placeholder={t('पूरा नाम')} required />
          <input name="username" placeholder={t('यूज़रनेम')} autoCapitalize="none" required />
          <input className="full" name="password" type="text" placeholder={t('पासवर्ड (कम से कम 6 अक्षर)')} required />
          <div className="perms full">{PERMS.map(([k, l]) => <label key={k}><input type="checkbox" name="perm" value={k} />{t(l)}</label>)}</div>
          <button className="b full">{t('यूज़र बनाएँ')}</button>
        </form>
        <h2>{t('सभी यूज़र')}</h2>
        {us.map(u => (
          <div key={u.id} className={'item' + (u.active ? '' : ' x')} style={{ display: 'block' }}>
            <b>{u.full_name}</b> <small style={{ display: 'inline' }}>@{u.username} · {u.role === 'superadmin' ? t('सुपरएडमिन') : t('एडमिन')}</small>
            {u.role !== 'superadmin' && <>
              <div className="perms">{PERMS.map(([k, l]) => <label key={k}><input type="checkbox" checked={u.perms.includes(k)}
                onChange={e => upd(u.id, { perms: e.target.checked ? [...u.perms, k] : u.perms.filter((p: string) => p !== k) })} />{t(l)}</label>)}</div>
              <div className="acts">
                <button className="g" onClick={() => upd(u.id, { active: !u.active })}>{u.active ? t('यूज़र बंद करें') : t('यूज़र चालू करें')}</button>
                <button className="g" onClick={() => { const p = prompt(t('नया पासवर्ड (कम से कम 6 अक्षर):')); if (p) upd(u.id, { password: p }); }}>{t('पासवर्ड बदलें')}</button>
              </div></>}
          </div>))}
      </>)}</>;
}
