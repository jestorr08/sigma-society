import QRCode from 'qrcode';
import { ORG } from '@/lib/config';
import type { IdData } from '@/components/LanyardCard';

export const idUrl = (id: string) => `${window.location.origin}/id/${id}`;
export const QR_OPTS = { margin: 1, width: 256, color: { dark: '#4a0d19', light: '#ffffff' } };

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

function poly(c: CanvasRenderingContext2D, pts: number[][], fill: string) {
  c.fillStyle = fill; c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath(); c.fill();
}

const ls = (c: CanvasRenderingContext2D, v: string) => { (c as unknown as { letterSpacing: string }).letterSpacing = v; };

function fit(c: CanvasRenderingContext2D, text: string, max: number, size: number, weight = 700) {
  let s = size;
  do { c.font = `${weight} ${s}px Arial, sans-serif`; s -= 0.5; } while (c.measureText(text).width > max && s > 7);
}

export async function downloadId(d: IdData) {
  const S = 3, W = 270, H = 440;
  const cv = document.createElement('canvas');
  cv.width = W * S; cv.height = H * S;
  const c = cv.getContext('2d');
  if (!c) return;
  c.scale(S, S);
  const qrUrl = await QRCode.toDataURL(idUrl(d.id), QR_OPTS);
  const [photo, logo, qr] = await Promise.all([load(d.photo_url), load(ORG.logo), load(qrUrl)]);
  const [w1, ...rest] = ORG.short.split(' ');

  c.save(); rr(c, 0, 0, W, H, 18); c.clip();
  c.fillStyle = '#17090d'; c.fillRect(0, 0, W, H);
  poly(c, [[0, 0], [140, 0], [0, 150]], '#221116');
  poly(c, [[0, 170], [70, 135], [70, 235], [0, 235]], '#1d0e12');
  [62, 106, 150].forEach((y) => poly(c, [[246, y + 14], [270, y], [270, y + 30], [246, y + 44]], '#b3203a'));
  c.fillStyle = '#b3203a'; rr(c, 100, 10, 70, 12, 6); c.fill();

  c.fillStyle = '#2b1a1f'; c.beginPath(); c.arc(135, 123, 65, 0, Math.PI * 2); c.fill();
  c.strokeStyle = 'rgba(179,32,58,.4)'; c.lineWidth = 4; c.beginPath(); c.arc(135, 123, 67, 0, Math.PI * 2); c.stroke();
 if (logo) {
  const k = Math.min(34 / logo.width, 34 / logo.height);
  c.drawImage(logo, 33 - (logo.width * k) / 2, 222 - (logo.height * k) / 2, logo.width * k, logo.height * k);
}

  c.save(); c.beginPath(); c.arc(33, 222, 17, 0, Math.PI * 2); c.clip();
  c.fillStyle = '#fff'; c.fillRect(16, 205, 34, 34);
  if (logo) c.drawImage(logo, 16, 205, 34, 34);
  c.restore();
  c.fillStyle = '#fff'; c.textAlign = 'left';
  c.font = '800 27px Arial, sans-serif'; c.fillText(w1.toUpperCase(), 58, 225);
  if (rest.length) {
    c.fillStyle = '#e58a99'; c.font = '9.6px Arial, sans-serif'; ls(c, '3.4px');
    c.fillText(rest.join(' ').toUpperCase(), 60, 242); ls(c, '0px');
  }

  const g = c.createLinearGradient(0, 0, 168, 0);
  g.addColorStop(0, '#b3203a'); g.addColorStop(1, '#8e1a2d');
  c.fillStyle = g; c.fillRect(0, 262, 168, 36);
  c.fillStyle = '#fff'; fit(c, d.full_name.toUpperCase(), 140, 11.2); c.fillText(d.full_name.toUpperCase(), 14, 284);

  [['Student ID', d.student_id], ['Program', d.program], ['Year level', d.year_level]].forEach(([k, v], i) => {
    const y = 315 + i * 16;
    c.fillStyle = '#b7a3a8'; c.font = '10px Arial, sans-serif'; c.fillText(k, 16, y);
    c.fillStyle = '#fff'; fit(c, v, 100, 10.5, 600); c.fillText(v, 72, y);
  });

  c.fillStyle = '#fff'; rr(c, 176, 258, 80, 80, 10); c.fill();
  if (qr) c.drawImage(qr, 181, 263, 70, 70);
  c.textAlign = 'center'; c.fillStyle = 'rgba(255,255,255,.8)'; c.font = '7.5px Arial, sans-serif';
  c.fillText('Scan to verify', 216, 351);

  c.strokeStyle = 'rgba(255,255,255,.14)'; c.lineWidth = 1;
  c.beginPath(); c.moveTo(14, 384.5); c.lineTo(256, 384.5); c.stroke();
  c.fillStyle = '#e58a99'; c.font = '700 11.5px Arial, sans-serif'; ls(c, '1.1px');
  c.fillText(`ID ${d.id_code}`, W / 2, 406);
  c.fillStyle = 'rgba(255,255,255,.55)'; c.font = '7.5px Arial, sans-serif'; ls(c, '1px');
  c.fillText(`${ORG.short.toUpperCase()} · MEMBER`, W / 2, 423); ls(c, '0px');
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