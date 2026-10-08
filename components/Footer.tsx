import Link from 'next/link';
import Logo from './Logo';
import { ORG } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-in">
        <div>
          <Logo light />
          <p>{ORG.full}</p>
        </div>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/membership">Membership</Link>
        </nav>
      </div>
      <div className="wrap copy">© {new Date().getFullYear()} {ORG.short}. All rights reserved.</div>
    </footer>
  );
}
