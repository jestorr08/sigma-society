'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.dataset.theme === 'dark'); }, []);
  function toggle() {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
    setDark(!dark);
  }
  return (
    <button className={dark ? 'tt is-dark' : 'tt'} onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <Sun size={20} className="ic sun" />
      <Moon size={20} className="ic moon" />
    </button>
  );
}