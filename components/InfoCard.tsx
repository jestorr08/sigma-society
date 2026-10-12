'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function InfoCard({ title, text, href }: { title: string; text: string; href: string }) {
  const [long, setLong] = useState(false);
  const p = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const check = () => {
      const el = p.current;
      if (el) setLong(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [text]);

  return (
    <div className="ibox">
      <h3>{title}</h3>
      <p ref={p} className="ibox-p">{text}</p>
      {long && <Link href={href} className="ibox-more">Learn more</Link>}
    </div>
  );
}