'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const links = [['/', 'Home'], ['/events', 'Events'], ['/membership', 'Membership']];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

 const atTop = !scrolled && !open;

  return (
    <header className={atTop ? 'nav nav-top' : 'nav'}>
      <div className="wrap nav-in">
        <Link href="/" aria-label="SIGMA Society home"><Logo /></Link>
        <div className="nav-r">
          <nav className={open ? 'links open' : 'links'}>
            {links.map(([href, label]) => (
              <Link key={href} href={href} className={path === href ? 'active' : ''} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
        </div>
      </div>
    </header>
  );
}