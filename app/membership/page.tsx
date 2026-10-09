'use client';
import { useState, FormEvent, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase';
import LanyardCard, { IdData } from '@/components/LanyardCard';
import { Camera } from 'lucide-react';

const blank = { full_name: '', student_id: '', program: '', year_level: '1st Year', section: '', email: '', phone: '' };

export default function Membership() {
  const [f, setF] = useState(blank);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<IdData | null>(null);

  const set = (k: keyof typeof blank) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  function pick(e: ChangeEvent<HTMLInputElement>) {
    const x = e.target.files?.[0];
    if (!x) return;
    if (!x.type.startsWith('image/')) { e.target.value = ''; return setErr('Please choose an image file.'); }
    if (x.size > 2 * 1024 * 1024) { e.target.value = ''; setFile(null); setPreview(''); return setErr('Photo must be 2MB or smaller.'); }
    setErr(''); setFile(x); setPreview(URL.createObjectURL(x));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!file) return setErr('Please upload your photo.');
    setBusy(true); setErr('');
    const id = crypto.randomUUID();
    const path = `${id}.${file.name.split('.').pop()}`;
    const up = await supabase.storage.from('member-photos').upload(path, file);
    if (up.error) { setBusy(false); return setErr(up.error.message); }
    const photo_url = supabase.storage.from('member-photos').getPublicUrl(path).data.publicUrl;
    const id_code = `SIG-${new Date().getFullYear()}-${id.slice(0, 6).toUpperCase()}`;
    const { error } = await supabase.from('members').insert({ id, id_code, ...f, photo_url });
    setBusy(false);
    if (error) return setErr(error.code === '23505' ? 'This student ID is already registered.' : error.message);
    setDone({ ...f, id_code, photo_url: preview });
  }

  if (done)
    return (
      <div className="wrap section center">
        <h1 className="page-title">Welcome to SIGMA, {done.full_name.split(' ')[0]}.</h1>
        <p className="muted">Your membership ID is ready. Drag the card to give it a swing.</p>
        <LanyardCard d={done} />
        <button className="link-btn" onClick={() => { setDone(null); setF(blank); setFile(null); setPreview(''); }}>Register another member</button>
      </div>
    );

  return (
    <div className="wrap section narrow">
      <h1 className="page-title">Become a member</h1>
      <p className="muted">Fill in your details. Your ID is generated as soon as you submit.</p>
      <form onSubmit={submit} className="form">
        <label>Full name<input required value={f.full_name} onChange={set('full_name')} /></label>
        <label>Student ID number<input required value={f.student_id} onChange={set('student_id')} /></label>
        <label>Program / course<input required placeholder="e.g. BS Statistics" value={f.program} onChange={set('program')} /></label>
        <div className="row2">
          <label>Year level
            <select value={f.year_level} onChange={set('year_level')}>
              {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'].map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>
          <label>Section<input value={f.section} onChange={set('section')} /></label>
        </div>
        <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
        <label>Mobile number<input type="tel" value={f.phone} onChange={set('phone')} /></label>
       <div className="filepick">
  <span>Photo (max 2MB)</span>
  <label className="filebtn">
    <Camera size={20} />
    <span>{file ? file.name : 'Upload photo'}</span>
    <input type="file" accept="image/*" hidden onChange={pick} />
  </label>
</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview && <img className="thumb" src={preview} alt="Preview" />}
        {err && <p className="error">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Submitting…' : 'Submit and get my ID'}</button>
      </form>
    </div>
  );
}
