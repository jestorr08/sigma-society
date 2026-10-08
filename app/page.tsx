import Link from 'next/link';
import { ORG, OFFICERS } from '@/lib/config';

function Avatar({ name, photo }: { name?: string; photo?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (photo) return <img className="avatar" src={photo} alt={name ?? ''} />;
  return <span className="avatar">{(name ?? '?').split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>;
}
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>Where numbers<br />find their people.</h1>
          <p className="lead">{ORG.full}</p>
          <Link href="/membership" className="btn">Join SIGMA</Link>
        </div>
      </section>

      <section className="section wrap two">
        <div>
          <h2>What SIGMA is about</h2>
          <p>{ORG.about}</p>
        </div>
        <div>
          <h2>Our goals</h2>
          <ul className="goals">{ORG.goals.map((g) => <li key={g}>{g}</li>)}</ul>
        </div>
      </section>

<section className="section wrap">
  <h2>Executive Officers</h2>
  <div className="grid officers">
    <div className="person">
      <Avatar name={ORG.adviser.name} photo={ORG.adviser.photo} />
      <b>{ORG.adviser.name}</b>
      <span>{ORG.adviser.title}</span>
    </div>
    {OFFICERS.map((o) => (
      <div className="person" key={o.role}>
        <Avatar name={o.name} photo={o.photo} />
        <b>{o.name}</b>
        <span>{o.role}</span>
      </div>
    ))}
  </div>
</section>

     

      <section className="cta">
        <div className="wrap">
          <h2>Ready to be part of SIGMA?</h2>
          <Link href="/membership" className="btn invert">Become a member</Link>
        </div>
      </section>
    </>
  );
}
