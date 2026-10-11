import { ORG } from '@/lib/config';
import type { IdData } from '@/components/LanyardCard';

const load = (src: string) =>
  new Promise<HTMLImageElement | null>((res) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

export async function downloadId(d: IdData) {
  const W = 640, H = 1000;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  if (!c) return;
  const [photo, logo] = await Promise.all([load(d.photo_url), load(ORG.logo)]);

  c.fillStyle = '#fff'; rr(c, 0, 0, W, H, 36); c.fill();
  c.save(); rr(c, 0, 0, W, H, 36); c.clip();
  c.fillStyle = '#7a1426'; c.fillRect(0, 0, W, 170);
  c.fillStyle = 'rgba(255,255,255,.35)'; rr(c, W / 2 - 40, 18, 80, 14, 7); c.fill();

  if (logo) {
    c.save(); c.beginPath(); c.arc(110, 100, 36, 0, Math.PI * 2); c.clip();
    c.drawImage(logo, 74, 64, 72, 72); c.restore();
  }
  c.fillStyle = '#fff'; c.font = '700 40px Arial, sans-serif'; c.textAlign = 'left';
  c.fillText(ORG.short, 165, 114);

  c.textAlign = 'center';
  if (photo) {
    const s = 240 / Math.min(photo.width, photo.height);
    c.save(); c.beginPath(); c.arc(320, 380, 120, 0, Math.PI * 2); c.clip();
    c.drawImage(photo, 320 - (photo.width * s) / 2, 380 - (photo.height * s) / 2, photo.width * s, photo.height * s);
    c.restore();
  } else {
    c.fillStyle = '#eee'; c.beginPath(); c.arc(320, 380, 120, 0, Math.PI * 2); c.fill();
  }
  c.lineWidth = 8; c.strokeStyle = '#7a1426';
  c.beginPath(); c.arc(320, 380, 124, 0, Math.PI * 2); c.stroke();

  let size = 44;
  do { c.font = `700 ${size}px Georgia, serif`; size -= 2; } while (c.measureText(d.full_name).width > W - 80 && size > 20);
  c.fillStyle = '#1c0a0e'; c.fillText(d.full_name, W / 2, 570);
  c.font = '26px Arial, sans-serif'; c.fillStyle = '#555';
  c.fillText(`${d.program} · ${d.year_level}`, W / 2, 620);
  c.fillText(d.student_id, W / 2, 662);
  c.font = '700 32px Arial, sans-serif'; c.fillStyle = '#7a1426';
  c.fillText(d.id_code, W / 2, 750);

  let x = 90;
  for (let i = 0; x < W - 90; i++) {
    const w = 3 + (d.id_code.charCodeAt(i % d.id_code.length) % 4);
    c.fillStyle = '#222'; c.fillRect(x, 820, w, 80);
    x += w + 3 + ((i * 7) % 3);
  }
  c.restore();

  cv.toBlob((b) => {
    if (!b) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `SIGMA-ID-${d.id_code}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, 'image/png');
}