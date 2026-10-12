import { Target, Eye, ListChecks, ImageIcon } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { ORG } from '@/lib/config';

export const metadata = { title: 'About | SIGMA Society' };

export default function About() {
  const { image, caption } = ORG.accreditation;
  return (
    <div className="wrap section about">
      <Reveal as="h1" className="page-title">About SIGMA</Reveal>
      <Reveal as="p" className="muted about-lead" delay={100}>{ORG.full}</Reveal>

      <div className="about-grid">
        <Reveal id="mission" className="abox" delay={100}>
          <div className="abox-head"><Target size={20} /><h2>Mission</h2></div>
          <p>{ORG.mission}</p>
        </Reveal>
        <Reveal id="vision" className="abox" delay={200}>
          <div className="abox-head"><Eye size={20} /><h2>Vision</h2></div>
          <p>{ORG.vision}</p>
        </Reveal>
        <Reveal id="objectives" className="abox wide" delay={100}>
          <div className="abox-head"><ListChecks size={20} /><h2>Objectives</h2></div>
          <p>{ORG.objectives}</p>
        </Reveal>
      </div>

 <Reveal as="section" id="accreditation" className="accr-panel">
  <h2>Accreditation</h2>
  {caption && <p>{caption}</p>}
  <div className="accr-frame">
    {image ? (
      <a href={image} aria-label="View accreditation full size">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="SIGMA Society accreditation" />
      </a>
    ) : (
      <div className="accr-ph">
        <ImageIcon size={40} />
        <span>Accreditation photo</span>
      </div>
    )}
  </div>
</Reveal>
    </div>
  );
}