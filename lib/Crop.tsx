'use client';
import { useEffect, useRef, useState } from 'react';

export default function Crop({ file, aspect, outW, circle, type, onDone, onCancel }: any) {
  const W = Math.min(340, (typeof window !== 'undefined' ? window.innerWidth : 400) - 64);
  const H = W / aspect;
  const [url] = useState(() => URL.createObjectURL(file));
  const [im, setIm] = useState<HTMLImageElement | null>(null);
  const [z, setZ] = useState(1);
  const [o, setO] = useState({ x: 0, y: 0 });
  const drag = useRef<any>(null);
  useEffect(() => {
    const i = new Image();
    i.onload = () => { setIm(i); const s = Math.max(W / i.width, H / i.height); setO({ x: (W - i.width * s) / 2, y: (H - i.height * s) / 2 }); };
    i.src = url;
  }, []);
  if (!im) return null;
  const s0 = Math.max(W / im.width, H / im.height), s = s0 * z;
  const clamp = (x: number, y: number, sc = s) => ({ x: Math.min(0, Math.max(W - im.width * sc, x)), y: Math.min(0, Math.max(H - im.height * sc, y)) });
  const zoom = (nz: number) => { const ns = s0 * nz; const cx = (W / 2 - o.x) / s, cy = (H / 2 - o.y) / s; setZ(nz); setO(clamp(W / 2 - cx * ns, H / 2 - cy * ns, ns)); };
  const save = () => {
    const c = document.createElement('canvas'); c.width = outW; c.height = Math.round(outW / aspect);
    c.getContext('2d')!.drawImage(im, -o.x / s, -o.y / s, W / s, H / s, 0, 0, c.width, c.height);
    c.toBlob(b => onDone(b), type, 0.88);
  };
  return (
    <div className="modal"><div className="mbox">
      <b>फ़ोटो सेट करें</b>
      <small>फ़ोटो को उँगली से खिसकाएँ और नीचे स्लाइडर से बड़ा-छोटा करें। फ्रेम में जितना दिख रहा है, उतना ही सेव होगा।</small>
      <div className="frame" style={{ width: W, height: H, borderRadius: circle ? '50%' : 12 }}
        onPointerDown={e => { (e.currentTarget as any).setPointerCapture(e.pointerId); drag.current = { px: e.clientX, py: e.clientY, ox: o.x, oy: o.y }; }}
        onPointerMove={e => { const d = drag.current; if (d) setO(clamp(d.ox + e.clientX - d.px, d.oy + e.clientY - d.py)); }}
        onPointerUp={() => (drag.current = null)}>
        <img src={url} alt="" draggable={false} style={{ position: 'absolute', left: o.x, top: o.y, width: im.width * s, height: im.height * s, maxWidth: 'none', pointerEvents: 'none' }} />
      </div>
      <input type="range" min="1" max="3" step="0.02" value={z} onChange={e => zoom(+e.target.value)} aria-label="ज़ूम" />
      <div className="acts"><button className="b" onClick={save}>सेव करें</button><button className="g" onClick={onCancel}>रद्द करें</button></div>
    </div></div>
  );
}
