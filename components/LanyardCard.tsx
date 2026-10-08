'use client';
import { useEffect, useRef } from 'react';
import { ORG } from '@/lib/config';

export type IdData = {
  full_name: string; student_id: string; program: string; year_level: string; id_code: string; photo_url: string;
};

// Pendulum physics: drag (mouse or touch) to swing the card, release and it settles.
export default function LanyardCard({ d }: { d: IdData }) {
  const stage = useRef<HTMLDivElement>(null);
  const swing = useRef<HTMLDivElement>(null);
  const s = useRef({ a: 0.5, w: 0, drag: false, lastA: 0, lastT: 0 });

  useEffect(() => {
    let raf = 0, last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.033); last = t;
      const o = s.current;
      if (!o.drag) {
        o.w += (-26 * Math.sin(o.a) - 1.1 * o.w) * dt; // gravity + damping
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
    o.w = (a - o.lastA) / Math.max((now - o.lastT) / 1000, 0.008);
    o.w = Math.max(-12, Math.min(12, o.w));
    o.a = a; o.lastA = a; o.lastT = now;
  };

  return (
    <div className="stage" ref={stage} onPointerMove={move}
      onPointerUp={() => (s.current.drag = false)} onPointerLeave={() => (s.current.drag = false)}>
      <div className="swing" ref={swing}>
        <div className="strap"><span /></div>
        <div className="clip" />
        <div className="idcard" onPointerDown={(e) => { s.current.drag = true; s.current.lastA = s.current.a; s.current.lastT = performance.now(); (e.target as Element).setPointerCapture?.(e.pointerId); }}>
          <div className="hole" />
          <div className="id-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ORG.logo} alt="" width={28} height={28} draggable={false} />
            <b>{ORG.short}</b>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="id-photo" src={d.photo_url} alt={d.full_name} draggable={false} />
          <h3>{d.full_name}</h3>
          <p>{d.program} · {d.year_level}</p>
          <p className="muted">{d.student_id}</p>
          <div className="id-code">{d.id_code}</div>
          <div className="bars" />
        </div>
      </div>
    </div>
  );
}
