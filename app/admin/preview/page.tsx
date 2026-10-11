'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { downloadId } from '@/lib/idCard';
import LanyardCard, { IdData } from '@/components/LanyardCard';

const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#efe3e5"/><circle cx="60" cy="46" r="22" fill="#c9a9ae"/><path d="M16 120c4-30 24-44 44-44s40 14 44 44z" fill="#c9a9ae"/></svg>'
)}`;

const sample: IdData = {
  id: 'preview',
  full_name: 'Full Name',
  student_id: 'Student ID',
  program: 'Program',
  year_level: 'Year Level',
  id_code: 'SIG-0000-XXXXXX',
  photo_url: PHOTO,
};

export default function IdPreview() {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setOk(true);
      else router.replace('/admin');
    });
  }, [router]);

  if (!ok) return null;

  return (
    <div className="wrap section center">
      <h1 className="page-title">ID preview</h1>
      <p className="muted">A sample ID with placeholder details, so you can check design changes.</p>
      <LanyardCard d={sample} />
      <div className="row actions">
        <button className="btn" onClick={() => downloadId(sample)}><Download size={16} /> Download sample PNG</button>
        <Link href="/admin" className="link-btn">Back to members</Link>
      </div>
    </div>
  );
}