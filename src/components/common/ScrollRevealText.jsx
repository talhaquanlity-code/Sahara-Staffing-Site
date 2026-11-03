import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRevealText({
  text,
  as: Component = 'p',
  className = '',
  theme = 'dark', // 'dark' (on light bg) or 'light' (on dark bg)
  start = 'top 88%',
  end = 'bottom 58%',
  scrub = 0.5,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.reveal-word');
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          opacity: theme === 'dark' ? 0.18 : 0.22,
          y: 4,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, theme, start, end, scrub]);

  // Split text by whitespace into spans
  const words = typeof text === 'string' ? text.trim().split(/\s+/) : [];

  return (
    <Component ref={containerRef} className={`${className} select-text`}>
      {words.map((word, i) => (
        <span key={i} className="reveal-word inline-block mr-[0.26em] will-change-transform">
          {word}
        </span>
      ))}
    </Component>
  );
}

