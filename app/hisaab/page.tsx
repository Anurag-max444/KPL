'use client';
import { useState } from 'react';
import { useApp, rs, csv, PERMS, CATS, today } from '../../lib/ctx';
import Crop from '../../lib/Crop';

export default function Page() {
  const { bal, me, cfg, year, ch, kh, au, us, can, ach, akh, tin, tout, todayIn, catRows, colRows, vilRows, wa, addCh, addKh, cancel, openBill, addUser, upd, saveCfg, upImg, load } = useApp();
  
  return <>{(<>
        {can('view_chanda') && can('view_kharch') && <div className="stats">
          <div className="st big"><small>बचा हुआ पैसा</small><b className={bal < 0 ? 'neg' : ''}>{rs(bal)}</b></div>
          <div className="st"><small>चंदा · {ach.length} रसीद</small><b>{rs(tin)}</b></div>
          <div className="st"><small>खर्च · {akh.length} एंट्री</small><b>{rs(tout)}</b></div>
        </div>}
        {can('view_chanda') && <div className="item"><span>आज का चंदा</span><b className="amt">{rs(todayIn)}</b></div>}
        {can('view_kharch') && <><h2>श्रेणी के अनुसार खर्च</h2>
          {catRows.length ? catRows.map(([k, v]) => <div key={k} className="item" style={{ display: 'block' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{k}</span><b>{rs(v)}</b></div><div className="bar"><i style={{ width: (v / tout) * 100 + '%' }} /></div></div>) : <div className="empty">अभी कोई खर्च नहीं जोड़ा गया</div>}</>}
        {me.role === 'superadmin' && <><h2>किसने कितना चंदा जमा किया</h2>
          {colRows.length ? colRows.map(([k, v]) => <div key={k} className="item"><div><b>{k}</b><small>{ach.filter(x => x.collector === k).length} रसीद · {Math.round((v / tin) * 100)}% हिस्सा</small></div><b className="amt">{rs(v)}</b></div>) : <div className="empty">अभी कोई चंदा नहीं जोड़ा गया</div>}
          <h2>गाँव के अनुसार चंदा</h2>
          {vilRows.map(([k, v]) => <div key={k} className="item"><span>{k}</span><b className="amt">{rs(v)}</b></div>)}</>}
        <div className="acts" style={{ marginTop: 14 }}>
          <button className="g" onClick={() => window.print()}>प्रिंट / PDF</button>
          {can('view_chanda') && <button className="g" onClick={() => csv(ch, `KPL_chanda_${year}.csv`)}>चंदा CSV</button>}
          {can('view_kharch') && <button className="g" onClick={() => csv(kh, `KPL_kharch_${year}.csv`)}>खर्च CSV</button>}
        </div>
      </>)}</>;
}
