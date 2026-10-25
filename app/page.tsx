'use client';
import { useEffect, useState } from 'react';
import { useApp } from '../lib/ctx';
import { sb } from '../lib/supabase';

export default function Home() {
  const { me, cfg } = useApp();
  const [mem, setMem] = useState<any[]>([]);
  useEffect(() => { sb.from('kpl_members').select('*').order('sort').order('id').then(({ data }) => setMem(data || [])); }, []);
  return (<>
    <div className="hero2">
      <div className="pic" style={cfg.durga ? { backgroundImage: `url(${cfg.durga})` } : undefined} />
      <div className="info">
        {cfg.logo && <img className="logo" src={cfg.logo} alt="" />}
        <div><h1>{cfg.name || 'केपीएल दुर्गा पूजा समिति'}</h1>{cfg.tagline && <p>{cfg.tagline}</p>}<small>{[cfg.dates, cfg.address].filter(Boolean).join(' · ')}</small></div>
      </div>
    </div>
    {me.role === 'superadmin' && !cfg.durga && <div className="empty">⚙️ मैनेज → सेटिंग में जाकर लोगो और दुर्गा जी की फ़ोटो लगाएँ</div>}
    {mem.length > 0 && <><h2>समिति के सदस्य</h2>
      <div className="mem">{mem.map(m => <div key={m.id} className="m">{m.photo ? <img src={m.photo} alt="" /> : <div className="ph">{m.name[0]}</div>}<b>{m.name}</b><small>{m.role}</small></div>)}</div></>}
  </>);
}
