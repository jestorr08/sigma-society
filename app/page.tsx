import Link from 'next/link';
import { ORG, OFFICERS } from '@/lib/config';
import EyeLogo from '@/components/EyeLogo';
import Reveal from '@/components/Reveal';
import RecentEvents from '@/components/RecentEvents';
import ScrollHint from '@/components/ScrollHint';
import InfoCard from '@/components/InfoCard';

function Avatar({ name, photo }: { name?: string; photo?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (photo) return <img className="avatar" src={photo} alt={name ?? ''} />;
  return <span className="avatar">{(name ?? '?').split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>;
}

export default function Home() {
  return (
    <>
      <ScrollHint />

      <section className="hero">
        <div className="wrap hero-in">
          <div className="hero-text">
            <h1>SIGMA<br />SOCIETY</h1>
            <p className="lead">{ORG.full}</p>
            <div className="hero-btns">
              <Link href="/membership" className="btn invert">Join SIGMA</Link>
              <a href="#about" className="btn ghost">Learn more</a>
            </div>
          </div>
          <div className="hero-fig"><EyeLogo /></div>
        </div>
      </section>

      <section id="about" className="section wrap">
        <Reveal as="h2">What SIGMA is about</Reveal>
        <div className="ibox-grid">
          <Reveal delay={100}><InfoCard title="Mission" text={ORG.mission} href="/about#mission" /></Reveal>
          <Reveal delay={200}><InfoCard title="Vision" text={ORG.vision} href="/about#vision" /></Reveal>
          <Reveal delay={300}><InfoCard title="Objectives" text={ORG.objectives} href="/about#objectives" /></Reveal>
        </div>
      </section>

      <RecentEvents />

      <section className="section wrap">
        <Reveal as="h2">Executive Officers</Reveal>
        <div className="grid officers">
          <Reveal className="ocard">
            <Avatar name={ORG.adviser.name} photo={ORG.adviser.photo} />
            <div className="ocap">
              <b>{ORG.adviser.name}</b>
              <span>{ORG.adviser.title}</span>
            </div>
          </Reveal>
          {OFFICERS.map((o, i) => (
            <Reveal className="ocard" key={o.role} delay={((i + 1) % 3) * 120}>
              <Avatar name={o.name} photo={o.photo} />
              <div className="ocap">
                <b>{o.name}</b>
                <span>{o.role}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="section" className="cta">
        <div className="wrap">
          <h2>Ready to be part of SIGMA?</h2>
          <Link href="/membership" className="btn invert">Become a member</Link>
        </div>
      </Reveal>
    </>
  );
}