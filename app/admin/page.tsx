'use client';
import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { downloadId } from '@/lib/idCard';
import type { IdData } from '@/components/LanyardCard';

type Member = IdData & { id: string; created_at: string };

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    supabase.from('members').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setMsg(error.message);
        setMembers((data as Member[]) ?? []);
      });
  }, [signedIn]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : '');
  }

  const shown = members.filter((m) =>
    `${m.full_name} ${m.student_id} ${m.id_code}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className={signedIn ? 'wrap section' : 'wrap section narrow'}>
      <h1 className="page-title">Admin</h1>
      {signedIn ? (
        <>
         <div className="row admin-top">
            <Link href="/events" className="btn">Go to Events</Link>
            <Link href="/admin/preview" className="btn">Preview ID</Link>
          <button className="link-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
         </div>
          <div className="row-between mh">
            <h2>Members ({members.length})</h2>
            <input className="search" placeholder="Search name or student ID" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {msg && <p className="error">{msg}</p>}
          {members.length === 0 && !msg && <p className="muted">No members yet.</p>}
          {members.length > 0 && shown.length === 0 && <p className="muted">No matches.</p>}
          <div className="mgrid">
            {shown.map((m) => (
              <div className="mcard" key={m.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.photo_url} alt={m.full_name} />
                <div className="mbody">
                  <b>{m.full_name}</b>
                  <span>{m.program} · {m.year_level}</span>
                  <span>{m.student_id}</span>
                  <code>{m.id_code}</code>
                </div>
                <button className="mdl" onClick={() => downloadId(m)}><Download size={16} /> Download ID</button>
              </div>
            ))}
          </div>
        </>
      ) : signedIn === false ? (
        <form onSubmit={submit} className="form">
          <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {msg && <p className="error">{msg}</p>}
          <button className="btn">Sign in</button>
        </form>
      ) : null}
    </div>
  );
}