'use client';
import { useEffect, useRef } from 'react';

const EYES = [{ l: 23.9, t: 23.1 }, { l: 57.5, t: 23.5 }];

export default function EyeLogo({ src = '/sigma-logo.png' }: { src?: string }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = box.current;
    if (!root) return;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const eyes = Array.from(root.querySelectorAll<HTMLElement>('.eye'));
    const pupils = eyes.map((e) => e.querySelector<HTMLElement>('.pupil')!);
    const cur = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    let mx = 0, my = 0, lastMove = -9999, wx = 0, wy = 0, nextWander = 0, raf = 0;

    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; lastMove = performance.now(); };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onMove);

    const tick = (t: number) => {
      const idle = t - lastMove > 1500;
      if (idle && !calm && t > nextWander) {
        wx = Math.random() * 2 - 1; wy = (Math.random() * 2 - 1) * 0.6;
        nextWander = t + 900 + Math.random() * 1800;
      }
      eyes.forEach((eye, i) => {
        const r = eye.getBoundingClientRect();
        const maxX = r.width * 0.14, maxY = r.height * 0.05;
        let tx = 0, ty = 0;
        if (idle) { tx = calm ? 0 : wx * maxX * 0.5; ty = calm ? 0 : wy * maxY * 0.5; }
        else {
          const dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2);
          const d = Math.hypot(dx, dy) || 1, k = Math.min(d / 250, 1);
          tx = (dx / d) * maxX * k; ty = (dy / d) * maxY * k;
        }
        cur[i].x += (tx - cur[i].x) * 0.14;
        cur[i].y += (ty - cur[i].y) * 0.14;
        pupils[i].style.transform = `translate(calc(-50% + ${cur[i].x}px), calc(-50% + ${cur[i].y}px))`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let bt: ReturnType<typeof setTimeout>;
    const blink = () => {
      eyes.forEach((e) => e.classList.add('blink'));
      setTimeout(() => eyes.forEach((e) => e.classList.remove('blink')), 130);
      bt = setTimeout(blink, 2200 + Math.random() * 3800);
    };
    if (!calm) bt = setTimeout(blink, 1800);

    return () => {
      cancelAnimationFrame(raf); clearTimeout(bt);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
    };
  }, []);

  return (
    <div className="eyelogo" ref={box}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="SIGMA Society logo" draggable={false} />
      {EYES.map((e, i) => (
        <span className="eye" key={i} style={{ left: `${e.l}%`, top: `${e.t}%` }}>
          <span className="pupil"><i className="h1" /><i className="h2" /></span>
          <span className="lid" />
        </span>
      ))}
    </div>
  );
}