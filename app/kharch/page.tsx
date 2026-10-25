'use client';
import { useState } from 'react';
import { useApp, rs, csv, PERMS, CATS, today } from '../../lib/ctx';
import Crop from '../../lib/Crop';

export default function Page() {
  const { bal, me, cfg, year, ch, kh, au, us, can, ach, akh, tin, tout, todayIn, catRows, colRows, vilRows, wa, addCh, addKh, cancel, openBill, addUser, upd, saveCfg, upImg, load } = useApp();
  
  return <>{(<>
        {can('add_kharch') && <form onSubmit={addKh}>
          <select name="category">{CATS.map(c => <option key={c}>{c}</option>)}</select>
          <input name="amount" type="number" min="1" placeholder="राशि (₹)" inputMode="decimal" required />
          <input className="full" name="item" placeholder="किस चीज़ का खर्च" required />
          <input name="paid_to" placeholder="किसको दिया (दुकान/विक्रेता)" required />
          <input name="paid_on" type="date" defaultValue={today()} required />
          <input name="bill_no" placeholder="बिल नंबर" />
          <div><label className="f">खर्च किसने किया (अपने आप भरा)</label><input name="spent_by" defaultValue={me.full_name || me.username} readOnly style={{ background: '#f1ebe6', color: 'var(--ink)' }} /></div>
          <div className="full"><label className="f">बिल की फ़ोटो</label><input name="bill" type="file" accept="image/*,application/pdf" capture="environment" /></div>
          <button className="b full">खर्च जोड़ें</button>
        </form>}
        {kh.length ? kh.map(x => (
          <div key={x.id} className={'item' + (x.status === 'cancelled' ? ' x' : '')}>
            <div><div className="t"><b>{x.category}</b> · {x.item}</div>
              <small>{x.paid_on} · {x.paid_to}{x.bill_no ? ' · बिल ' + x.bill_no : ''} · {x.spent_by}</small>
              {x.status === 'cancelled' && <small>❌ रद्द: {x.cancel_reason}</small>}
              <div className="acts">
                {x.bill_path && <button className="g" onClick={() => openBill(x.bill_path)}>बिल देखें</button>}
                {x.status === 'active' && can('cancel_entry') && <button className="g danger" onClick={() => cancel('kharch', x.id)}>रद्द करें</button>}
              </div>
            </div><b className="amt">{rs(x.amount)}</b></div>
        )) : <div className="empty">{year} में अभी कोई खर्च नहीं जोड़ा गया</div>}
      </>)}</>;
}
