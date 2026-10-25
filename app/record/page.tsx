'use client';
import { useState } from 'react';
import { useApp, rs, csv, PERMS, CATS, today } from '../../lib/ctx';
import Crop from '../../lib/Crop';

export default function Page() {
  const { bal, me, cfg, year, ch, kh, au, us, can, ach, akh, tin, tout, todayIn, catRows, colRows, vilRows, wa, addCh, addKh, cancel, openBill, addUser, upd, saveCfg, upImg, load } = useApp();
  
  return <>{(au.length ? au.map(x => (
        <div key={x.id} className="item"><div><b>{x.username || '—'}</b> · {({ INSERT: 'जोड़ा', UPDATE: 'बदला / रद्द किया', USER_CREATE: 'यूज़र बनाया', USER_UPDATE: 'यूज़र बदला' } as any)[x.action] || x.action}
          <small>{new Date(x.at).toLocaleString('en-IN')} · {({ kpl_chanda: 'चंदा', kpl_kharch: 'खर्च', kpl_profiles: 'यूज़र' } as any)[x.tbl] || x.tbl}{x.row_id ? ' #' + x.row_id : ''}</small>
          {x.detail?.amount && <small>{rs(x.detail.amount)} · {x.detail.donor || x.detail.item} {x.detail.status === 'cancelled' ? '· रद्द' : ''}</small>}
        </div></div>)) : <div className="empty">अभी कोई रिकॉर्ड नहीं</div>)}</>;
}
