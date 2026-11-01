'use client';
import { useState } from 'react';
import { useApp, rs, csv, PERMS, CATS, today, Head } from '../../lib/ctx';
import Crop from '../../lib/Crop';

export default function Page() {
  const { t, bal, me, cfg, year, ch, kh, au, us, can, ach, akh, tin, tout, todayIn, catRows, colRows, vilRows, wa, addCh, addKh, cancel, openBill, addUser, upd, saveCfg, upImg, load } = useApp();
  
  return <><Head icon="📜" title={t('रिकॉर्ड')} sub={t('किसने, कब, क्या किया: पूरा रिकॉर्ड')} />{(au.length ? au.map(x => (
        <div key={x.id} className="item"><div><b>{x.username || '—'}</b> · {({ INSERT: t('जोड़ा'), UPDATE: t('बदला / रद्द किया'), USER_CREATE: t('यूज़र बनाया'), USER_UPDATE: t('यूज़र बदला') } as any)[x.action] || x.action}
          <small>{new Date(x.at).toLocaleString('en-IN')} · {({ kpl_chanda: t('चंदा'), kpl_kharch: t('खर्च'), kpl_profiles: t('यूज़र') } as any)[x.tbl] || x.tbl}{x.row_id ? ' #' + x.row_id : ''}</small>
          {x.detail?.amount && <small>{rs(x.detail.amount)} · {x.detail.donor || x.detail.item} {x.detail.status === 'cancelled' ? '· ' + t('रद्द') : ''}</small>}
        </div></div>)) : <div className="empty">{t('अभी कोई रिकॉर्ड नहीं')}</div>)}</>;
}
