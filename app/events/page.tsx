'use client';
import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { ImagePlus } from 'lucide-react';

type Ev = {
  id: string; title: string; event_date: string | null; kind: 'upcoming' | 'past';
  description: string | null; image_url: string | null; fb_url: string | null;
};
const empty = { title: '', event_date: '', kind: 'upcoming', description: '', fb_url: '' };
const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date to be announced';

export default function Events() {
  const [events, setEvents] = useState<Ev[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [panel, setPanel] = useState(false);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
    setEvents((data as Ev[]) ?? []);
  };

  useEffect(() => {
    load();
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setIsAdmin(!!s));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword(login);
    setMsg(error ? error.message : '');
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setMsg('Saving…');
    let image_url = events.find((x) => x.id === editId)?.image_url ?? null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) return setMsg('Image must be 5MB or smaller.');
      const path = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const up = await supabase.storage.from('event-images').upload(path, file);
      if (up.error) return setMsg(up.error.message);
      image_url = supabase.storage.from('event-images').getPublicUrl(path).data.publicUrl;
    }
    const row = { ...form, event_date: form.event_date || null, image_url };
    const r = editId
      ? await supabase.from('events').update(row).eq('id', editId)
      : await supabase.from('events').insert(row);
    if (r.error) return setMsg(r.error.message);
    setForm(empty); setFile(null); setEditId(null); setMsg('Saved.');
    load();
  }

  function edit(ev: Ev) {
    setEditId(ev.id); setFile(null);
    setForm({ title: ev.title, event_date: ev.event_date ?? '', kind: ev.kind, description: ev.description ?? '', fb_url: ev.fb_url ?? '' });
    setPanel(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id: string) {
    if (!confirm('Delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    load();
  }

  const upcoming = events.filter((e) => e.kind === 'upcoming').reverse();
  const past = events.filter((e) => e.kind === 'past');
  const AdminBar = ({ ev }: { ev: Ev }) =>
    isAdmin ? (
      <div className="admin-bar">
        <button onClick={() => edit(ev)}>Edit</button>
        <button onClick={() => remove(ev.id)}>Delete</button>
      </div>
    ) : null;

  return (
    <div className="wrap section">
      <div className="row-between">
        <h1 className="page-title">Events</h1>
         {isAdmin && <button className="link-btn" onClick={() => setPanel(!panel)}>Manage events</button>}      </div>

     {panel && isAdmin && (
        <div className="panel">
          {!isAdmin ? (
            <form onSubmit={signIn} className="form">
              <label>Admin email<input type="email" required value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} /></label>
              <label>Password<input type="password" required value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} /></label>
              <button className="btn">Sign in</button>
            </form>
          ) : (
            <form onSubmit={save} className="form">
              <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
              <label>Date<input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></label>
              <label>Type
                <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                  <option value="upcoming">Upcoming event</option>
                  <option value="past">Past event (gallery)</option>
                </select>
              </label>
              <label>Description<textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
              <label>Facebook post link<input type="url" placeholder="https://facebook.com/..." value={form.fb_url} onChange={(e) => setForm({ ...form, fb_url: e.target.value })} /></label>
              <div className="filepick">
  <span>Cover photo{editId && ' (leave empty to keep current)'}</span>
  <label className="filebtn">
    <ImagePlus size={20} />
    <span>{file ? file.name : 'Add photo'}</span>
    <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
  </label>
</div>
              <div className="row">
                <button className="btn">{editId ? 'Save changes' : 'Add event'}</button>
                {editId && <button type="button" className="link-btn" onClick={() => { setEditId(null); setForm(empty); }}>Cancel edit</button>}
                <button type="button" className="link-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
              </div>
            </form>
          )}
          {msg && <p className="note">{msg}</p>}
        </div>
      )}

      <h2>Upcoming</h2>
      {upcoming.length === 0 && <p className="muted">No upcoming events yet. Check back soon.</p>}
      <div className="list">
        {upcoming.map((ev) => (
                  <article className="upcoming" key={ev.id}>
            <time>{fmt(ev.event_date)}</time>
            <div><h3>{ev.title}</h3><p>{ev.description}</p><AdminBar ev={ev} /></div>
            {ev.image_url && (
              <div className="up-img">
                {ev.fb_url ? (
                  <a href={ev.fb_url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ev.image_url} alt={ev.title} />
                  </a>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ev.image_url} alt={ev.title} />
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      <h2 style={{ marginTop: 56 }}>Gallery</h2>
      {past.length === 0 && <p className="muted">Photos from our past events will appear here.</p>}
      <div className="grid gallery">
        {past.map((ev) => {
          const inner = (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {ev.image_url ? <img src={ev.image_url} alt={ev.title} /> : <div className="ph" />}
                           <div className="cap">
                <b>{ev.title}</b>
                <span>{fmt(ev.event_date)}</span>
                {ev.description && <p>{ev.description}</p>}
              </div>
            </>
          );
          return (
            <div className="shot" key={ev.id}>
              {ev.fb_url ? <a href={ev.fb_url} target="_blank" rel="noopener noreferrer">{inner}</a> : <div>{inner}</div>}
              <AdminBar ev={ev} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
