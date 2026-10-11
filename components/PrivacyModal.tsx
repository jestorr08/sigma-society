'use client';
import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyModal({ onAgree, onDecline }: { onAgree: () => void; onDecline: () => void }) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="pm-back" role="dialog" aria-modal="true" aria-labelledby="pm-title">
      <div className="pm">
        <div className="pm-head"><ShieldCheck size={26} /><h2 id="pm-title">Data Privacy Notice</h2></div>
        <div className="pm-body">
          <p>SIGMA Society respects your privacy and follows the Data Privacy Act of 2012 (Republic Act No. 10173). Please read how we handle your information before you register.</p>
          <h3>What we collect</h3>
          <p>Your full name, student ID number, program, year level, section, gender, mobile number and photo.</p>
          <h3>Why we collect it</h3>
          <p>Only for school organization purposes: keeping our membership records, making your member ID, and contacting you about organization activities and events.</p>
          <h3>How we protect it</h3>
          <ul>
            <li>Your information is kept confidential and is accessible only to authorized officers and the organization adviser.</li>
            <li>We do not sell, share or disclose it to outside parties, unless required by law or by the school.</li>
            <li>It is stored in a secured database and kept only while you are a member or as needed for the organization&apos;s records.</li>
          </ul>
          <h3>Your rights</h3>
          <p>You may ask to see, correct or delete your information, or withdraw your consent, by contacting the organization&apos;s officers.</p>
        </div>
        <label className="pm-check">
          <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />
          <span>I have read this notice and I agree to the collection and use of my personal information for the purposes stated above.</span>
        </label>
        <div className="pm-actions">
          <button type="button" className="link-btn" onClick={onDecline}>Decline</button>
          <button type="button" className="btn" disabled={!ok} onClick={onAgree}>Agree and continue</button>
        </div>
      </div>
    </div>
  );
}