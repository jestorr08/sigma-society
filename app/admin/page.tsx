'use client';
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);
    router.push('/events');
  }

  return (
    <div className="wrap section narrow">
      <h1 className="page-title">Admin</h1>
      {signedIn ? (
        <div className="form">
          <p>You are signed in.</p>
          <button className="btn" onClick={() => router.push('/events')}>Go to Events</button>
          <button className="link-btn" onClick={async () => { await supabase.auth.signOut(); setSignedIn(false); }}>Sign out</button>
        </div>
      ) : (
        <form onSubmit={submit} className="form">
          <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {msg && <p className="error">{msg}</p>}
          <button className="btn">Sign in</button>
        </form>
      )}
    </div>
  );
}