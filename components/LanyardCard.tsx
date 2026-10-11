'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { ORG } from '@/lib/config';
import { idUrl, QR_OPTS } from '@/lib/idCard';

export type IdData = {
  id: string; full_name: string; student_id: string; program: string;
  year_level: string; id_code: string; photo_url: string;
};

export default function LanyardCard({ d }: { d: IdData }) {
  const stage = useRef<HTMLDivElement>(null);
  const swing = useRef<HTMLDivElement>(null);
  const s = useRef({ a: 0.5, w: 0, drag: false, lastA: 0, lastT: 0 });
  const [qr, setQr] = useState('');
  const [w1, ...rest] = ORG.short.split(' ');
  const strapText = Array(4).fill(ORG.short.toUpperCase()).join('   •   ');

  useEffect(() => {
    QRCode.toDataURL(idUrl(d.id), QR_OPTS).then(setQr).catch(() => setQr(''));
  }, [d.id]);

  useEffect(() => {
    let raf = 0, last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.033); last = t;
      const o = s.current;
      if (!o.drag) {
        o.w += (-26 * Math.sin(o.a) - 1.1 * o.w) * dt;
        o.a += o.w * dt;
      }
      if (swing.current) swing.current.style.transform = `rotate(${o.a}rad)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const move = (e: React.PointerEvent) => {
    const o = s.current;
    if (!o.drag || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const a = Math.max(-1.2, Math.min(1.2, Math.atan2(e.clientX - (r.left + r.width / 2), Math.max(e.clientY - r.top, 60))));
    const now = performance.now();
    o.w = Math.max(-12, Math.min(12, (a - o.lastA) / Math.max((now - o.lastT) / 1000, 0.008)));
    o.a = a; o.lastA = a; o.lastT = now;
  };

  return (
    <div className="stage" ref={stage} onPointerMove={move}
      onPointerUp={() => (s.current.drag = false)} onPointerLeave={() => (s.current.drag = false)}>
      <div className="swing" ref={swing}>
        <div className="strap"><span>{strapText}</span></div>
        <div className="clip" />
        <div className="idc-wrap">
          <div className="idc" onPointerDown={(e) => {
            s.current.drag = true; s.current.lastA = s.current.a; s.current.lastT = performance.now();
            (e.target as Element).setPointerCapture?.(e.pointerId);
          }}>
            <svg className="idc-art" viewBox="0 0 270 440" aria-hidden="true">
              <polygon points="0,0 140,0 0,150" fill="#221116" />
              <polygon points="0,170 70,135 70,235 0,235" fill="#1d0e12" />
              {[62, 106, 150].map((y) => (
                <polygon key={y} points={`246,${y + 14} 270,${y} 270,${y + 30} 246,${y + 44}`} fill="#b3203a" />
              ))}
            </svg>
            <i className="idc-slot" />
            <div className="idc-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.photo_url} alt={d.full_name} draggable={false} />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="idc-logo" src={ORG.logo} alt="" draggable={false} />
            <b className="idc-sigma">{w1.toUpperCase()}</b>
            {rest.length > 0 && <span className="idc-soc">{rest.join(' ').toUpperCase()}</span>}
            <div className="idc-bar">{d.full_name.toUpperCase()}</div>
            <div className="idc-info">
              <em>Student ID</em><b>{d.student_id}</b>
              <em>Program</em><b>{d.program}</b>
              <em>Year level</em><b>{d.year_level}</b>
            </div>
            <div className="idc-qr">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {qr && <img src={qr} alt="QR code for this ID" draggable={false} />}
            </div>
            <small className="idc-scan">Scan to verify</small>
            <div className="idc-id">
              <b>ID {d.id_code}</b>
              <small>{ORG.short.toUpperCase()} · MEMBER</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}