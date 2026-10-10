'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Reveal from '@/components/Reveal';

type Ev = { id: string; title: string; event_date: string | null; image_url: string | null; fb_url: string | null };
const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date to be announced';

function Card({ ev, dup }: { ev: Ev; dup: boolean }) {
  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {ev.image_url ? <img src={ev.image_url} alt={ev.title} draggable={false} /> : <div className="ecard-ph">Σ</div>}
      <div className="ecard-body">
        <time>{fmt(ev.event_date)}</time>
        <b>{ev.title}</b>
      </div>
    </>
  );
  const extra = { 'aria-hidden': dup || undefined, tabIndex: dup ? -1 : undefined };
  return ev.fb_url ? (
    <a href={ev.fb_url} target="_blank" rel="noopener noreferrer" className="ecard" {...extra}>{inner}</a>
  ) : (
    <Link href="/events" className="ecard" {...extra}>{inner}</Link>
  );
}

export default function RecentEvents() {
  const [items, setItems] = useState<Ev[]>([]);

 useEffect(() => {
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time
  supabase.from('events').select('id,title,event_date,image_url,fb_url')
    .or(`kind.eq.past,event_date.lt.${today}`)
    .order('event_date', { ascending: false, nullsFirst: false })
    .limit(4)
    .then(({ data }) => setItems((data as Ev[]) ?? []));
}, []);

  const n = items.length;
  if (n === 0) return null;
  const moving = n >= 3;
  const loop = moving ? [...items, ...items, ...items, ...items] : items;

  return (
    <Reveal as="section" className="section wrap">
      <div className="row-between">
        <h2 className="sm-h">Recent events</h2>
        <Link href="/events" className="link-btn">See all events</Link>
      </div>
      <div className={moving ? 'mq' : 'mq still'}>
        <div className="mq-track">
          {loop.map((ev, k) => <Card key={`${ev.id}-${k}`} ev={ev} dup={k >= n} />)}
        </div>
      </div>
    </Reveal>
  );
}