'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LanyardCard, { IdData } from '@/components/LanyardCard';

export default function MemberId() {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<IdData | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading');

  useEffect(() => {
    supabase.rpc('get_member_card', { member_id: id }).then(({ data, error }) => {
      const row = Array.isArray(data) ? data[0] : null;
      if (error || !row) return setState('missing');
      setCard({ ...(row as Omit<IdData, 'id'>), id });
      setState('ok');
    });
  }, [id]);

  return (
    <div className="wrap section center">
      {state === 'loading' && <p className="muted">Loading ID…</p>}
      {state === 'missing' && (
        <>
          <h1 className="page-title">ID not found</h1>
          <p className="muted">We couldn&apos;t find a member for this QR code.</p>
        </>
      )}
      {state === 'ok' && card && (
        <>
          <h1 className="page-title">Member ID</h1>
          <LanyardCard d={card} />
        </>
      )}
      <div className="row actions">
        <Link href="/" className="btn"><ArrowLeft size={16} /> Back to home</Link>
      </div>
    </div>
  );
}