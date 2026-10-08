'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Logo from './Logo';

const links = [['/', 'Home'], ['/events', 'Events'], ['/membership', 'Membership']];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link href="/" aria-label="SIGMA Society home"><Logo /></Link>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
        <nav className={open ? 'links open' : 'links'}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={path === href ? 'active' : ''} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
