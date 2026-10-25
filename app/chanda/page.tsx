'use client';
import { useState } from 'react';
import { useApp, rs, csv, PERMS, CATS, today } from '../../lib/ctx';
import Crop from '../../lib/Crop';

export default function Page() {
  const { bal, me, cfg, year, ch, kh, au, us, can, ach, akh, tin, tout, todayIn, catRows, colRows, vilRows, wa, addCh, addKh, cancel, openBill, addUser, upd, saveCfg, upImg, load } = useApp();
  
  return <>{(<>
        {can('add_chanda') && <form onSubmit={addCh}>
          <input className="full" name="donor" placeholder="चंदा देने वाले का नाम" required />
          <input className="full" name="village" list="vl" placeholder="गाँव / मोहल्ले का नाम" required /><datalist id="vl">{vilRows.map(([k]) => <option key={k} value={k} />)}</datalist>
          <input name="amount" type="number" min="1" placeholder="राशि (₹)" inputMode="decimal" required />
          <input name="phone" type="tel" placeholder="फ़ोन (WhatsApp रसीद के लिए)" />
          <input name="paid_on" type="date" defaultValue={today()} required />
          <select name="mode"><option>नकद</option><option>UPI</option><option>बैंक</option></select>
          <div className="full"><label className="f">चंदा किसने लिया (अपने आप भरा, बदला नहीं जा सकता)</label><input name="collector" defaultValue={me.full_name || me.username} readOnly style={{ background: '#f1ebe6', color: 'var(--ink)' }} /></div>
          <input className="full" name="note" placeholder="नोट (वैकल्पिक)" />
          <button className="b full">चंदा जोड़ें</button>
        </form>}
        {ch.length ? ch.map(x => (
          <div key={x.id} className={'item' + (x.status === 'cancelled' ? ' x' : '')}>
            <div><div className="t"><b>#{x.id}</b> {x.donor}</div>
              <small>{x.village ? x.village + ' · ' : ''}{x.paid_on} · {x.mode} · {x.collector}{x.note ? ' · ' + x.note : ''}</small>
              {x.status === 'cancelled' && <small>❌ रद्द: {x.cancel_reason}</small>}
              {x.status === 'active' && <div className="acts">
                {x.phone && <a className="g" style={{ padding: '7px 11px', borderRadius: 8, border: '1px solid var(--bd)', fontSize: 13, textDecoration: 'none', color: 'var(--ink)' }} href={wa(x)} target="_blank">WhatsApp रसीद</a>}
                {can('cancel_entry') && <button className="g danger" onClick={() => cancel('chanda', x.id)}>रद्द करें</button>}
              </div>}
            </div><b className="amt">{rs(x.amount)}</b></div>
        )) : <div className="empty">{year} में अभी कोई चंदा नहीं जोड़ा गया</div>}
      </>)}</>;
}
