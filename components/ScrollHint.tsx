'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ScrollHint() {
  const [show, setShow] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const check = () => {
      if (window.scrollY > 30) done.current = true; // hidden for good once they scroll
      const scrollable = document.documentElement.scrollHeight > window.innerHeight + 60;
      setShow(!done.current && scrollable);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    const ro = new ResizeObserver(check); // events load after the page, so re-check as content grows
    ro.observe(document.body);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={show ? 'scrollhint show' : 'scrollhint'} aria-hidden="true">
      <span>Scroll</span>
      <ChevronDown size={20} />
    </div>
  );
}