'use client';
import { useState } from 'react';
import { useApp, rs, csv, PERMS, CATS, today, Head } from '../../lib/ctx';
import Crop from '../../lib/Crop';

export default function Page() {
  const { t, bal, me, cfg, year, ch, kh, au, us, can, ach, akh, tin, tout, todayIn, catRows, colRows, vilRows, wa, addCh, addKh, cancel, openBill, addUser, upd, saveCfg, upImg, load } = useApp();
  
  return <><Head icon="🧾" title={t('खर्च')} sub={`${akh.length} ${t('एंट्री')} · ${t('कुल')} ${rs(tout)}`} />{(<>
        {can('add_kharch') && <form onSubmit={addKh}>
          <select name="category">{CATS.map(c => <option key={c} value={c}>{t(c)}</option>)}</select>
          <input name="amount" type="number" min="1" placeholder={t('राशि (₹)')} inputMode="decimal" required />
          <input className="full" name="item" placeholder={t('किस चीज़ का खर्च')} required />
          <input name="paid_to" placeholder={t('किसको दिया (दुकान)')} required />
          <input name="paid_on" type="date" defaultValue={today()} required />
          <input name="bill_no" placeholder={t('बिल नंबर')} />
          <div><label className="f">{t('खर्च किसने किया (अपने आप भरा)')}</label><input name="spent_by" defaultValue={me.full_name || me.username} readOnly style={{ background: '#f1ebe6', color: 'var(--ink)' }} /></div>
          <div className="full"><label className="f">{t('बिल की फ़ोटो')}</label><input name="bill" type="file" accept="image/*,application/pdf" capture="environment" /></div>
          <button className="b full">{t('खर्च जोड़ें')}</button>
        </form>}
        {kh.length ? kh.map(x => (
          <div key={x.id} className={'item' + (x.status === 'cancelled' ? ' x' : '')}>
            <div><div className="t"><b>{t(x.category)}</b> · {x.item}</div>
              <small>{x.paid_on} · {x.paid_to}{x.bill_no ? ' · ' + t('बिल') + ' ' + x.bill_no : ''} · {x.spent_by}</small>
              {x.status === 'cancelled' && <small>❌ {t('रद्द')}: {x.cancel_reason}</small>}
              <div className="acts">
                {x.bill_path && <button className="g" onClick={() => openBill(x.bill_path)}>{t('बिल देखें')}</button>}
                {x.status === 'active' && can('cancel_entry') && <button className="g danger" onClick={() => cancel('kharch', x.id)}>{t('रद्द करें')}</button>}
              </div>
            </div><b className="amt out">{rs(x.amount)}</b></div>
        )) : <div className="empty">{t('अभी कोई खर्च नहीं जोड़ा गया')} ({year})</div>}
      </>)}</>;
}
