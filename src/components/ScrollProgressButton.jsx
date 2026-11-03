import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useScroll } from '../context/ScrollContext';
import { useCMS } from '../context/CMSContext';
import saharaMarkImg from '../assets/sahara-mark.png';

export default function ScrollProgressButton() {
  const { lenis, scrollTo } = useScroll();
  const { settings } = useCMS();
  const circleRef = useRef(null);
  const buttonRef = useRef(null);
  const markRef = useRef(null);

  // If back to top is disabled in global CMS settings, hide completely
  if (settings?.enableBackToTop === false) {
    return null;
  }

  // Visibility (after hero) and Page Bottom (transition to back-to-top arrow)
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isNearTop, setIsNearTop] = useState(true);
  const [ariaProgress, setAriaProgress] = useState(0);
  const [returnPos, setReturnPos] = useState(null);
  const returnPosRef = useRef(null);

  // Keep returnPosRef in sync
  useEffect(() => {
    returnPosRef.current = returnPos;
  }, [returnPos]);

  // SVG Geometry Constants for compact 44px button:
  // Center (22, 22), Radius: 19.5 -> Circumference ~122.52
  const radius = 19.5;
  const circumference = 2 * Math.PI * radius;

  // Track state in refs to prevent unnecessary re-renders during active scroll
  const stateRef = useRef({
    isVisible: false,
    isAtBottom: false,
    rafId: null,
  });

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = Math.max(1, docHeight - winHeight);

    const rawProgress = scrollTop / maxScroll;
    const progress = Math.min(1, Math.max(0, rawProgress));

    // Update SVG stroke-dashoffset directly on the DOM node for 60fps performance
    if (circleRef.current) {
      const offset = circumference * (1 - progress);
      circleRef.current.style.strokeDashoffset = `${offset}px`;
    }

    // State A: Smoothly reveals after initial scroll (~200px) OR if return position is available at top
    const nearTopNow = scrollTop < 180;
    setIsNearTop(nearTopNow);

    const hasReturn = returnPosRef.current !== null && nearTopNow;
    const shouldBeVisible = scrollTop > 200 || hasReturn;
    if (shouldBeVisible !== stateRef.current.isVisible) {
      stateRef.current.isVisible = shouldBeVisible;
      setIsVisible(shouldBeVisible);
    }

    // If user scrolled down near the saved return position, clear return position
    if (returnPosRef.current !== null && scrollTop > 250) {
      if (Math.abs(scrollTop - returnPosRef.current) < 80) {
        setReturnPos(null);
      }
    }

    // State C: Page Bottom with hysteresis to prevent threshold flicker
    let shouldBeAtBottom = stateRef.current.isAtBottom;
    if (!stateRef.current.isAtBottom) {
      if (progress >= 0.955 || scrollTop + winHeight >= docHeight - 60) {
        shouldBeAtBottom = true;
      }
    } else {
      if (progress < 0.92 && scrollTop + winHeight < docHeight - 120) {
        shouldBeAtBottom = false;
      }
    }

    if (shouldBeAtBottom !== stateRef.current.isAtBottom) {
      stateRef.current.isAtBottom = shouldBeAtBottom;
      setIsAtBottom(shouldBeAtBottom);
    }

    const currentPercent = Math.round(progress * 100);
    setAriaProgress(currentPercent);
  }, [circumference]);

  useEffect(() => {
    updateProgress();

    const handleScroll = () => {
      if (stateRef.current.rafId !== null) return;
      stateRef.current.rafId = requestAnimationFrame(() => {
        updateProgress();
        stateRef.current.rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    if (lenis) {
      lenis.on('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (lenis) {
        lenis.off('scroll', handleScroll);
      }
      if (stateRef.current.rafId !== null) {
        cancelAnimationFrame(stateRef.current.rafId);
      }
    };
  }, [lenis, updateProgress]);

  // Handle bidirectional intelligent click:
  // - When down page: saves position and smoothly scrolls to top
  // - When at top with saved return position: returns smoothly back down to previous position
  const handleScrollClick = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
    const isAtTopWithReturn = currentScroll < 200 && returnPosRef.current !== null && returnPosRef.current > 250;

    if (isAtTopWithReturn) {
      const target = returnPosRef.current;
      setReturnPos(null);
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.0,
          immediate: false,
          lock: false,
          force: true,
        });
      } else {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    } else {
      if (currentScroll > 250) {
        setReturnPos(currentScroll);
      }
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 1.0,
          immediate: false,
          lock: false,
          force: true,
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // State for 360° axial rotation & magnetic cursor follow across the entire website
  const rotStateRef = useRef({
    currentAngle: 0,
    targetAngle: 0,
    currentDx: 0,
    targetDx: 0,
    currentDy: 0,
    targetDy: 0,
    isHovered: false,
    rafId: null,
  });

  const startAnimationLoop = useCallback(() => {
    if (rotStateRef.current.rafId !== null) return;

    const animate = () => {
      const state = rotStateRef.current;

      // Shortest angular path unwrapping across 360°
      let diffAngle = state.targetAngle - state.currentAngle;
      while (diffAngle > 180) diffAngle -= 360;
      while (diffAngle < -180) diffAngle += 360;

      // Premium liquid damping physics
      state.currentAngle += diffAngle * 0.14;
      state.currentDx += (state.targetDx - state.currentDx) * 0.18;
      state.currentDy += (state.targetDy - state.currentDy) * 0.18;

      // Rotate the inner Sahara symbol 360° on its central axis across the entire website
      if (markRef.current) {
        markRef.current.style.transform = `rotate(${state.currentAngle}deg) perspective(240px) rotateY(${state.currentDx * 14}deg) rotateX(${-state.currentDy * 14}deg) scale(1.06)`;
      }

      // Magnetic elastic pull on the button itself only when directly hovering/close
      if (buttonRef.current) {
        const btnDx = state.isHovered ? Math.max(-1, Math.min(1, state.currentDx)) * 4.5 : 0;
        const btnDy = state.isHovered ? Math.max(-1, Math.min(1, state.currentDy)) * 4.5 : 0;
        buttonRef.current.style.transform = `translate3d(${btnDx}px, ${btnDy}px, 0) perspective(240px) rotateX(${-btnDy * 1.5}deg) rotateY(${btnDx * 1.5}deg)`;
      }

      // If settled close to target and not hovering directly, pause loop to save CPU
      if (
        Math.abs(diffAngle) < 0.08 &&
        Math.abs(state.targetDx - state.currentDx) < 0.01 &&
        Math.abs(state.targetDy - state.currentDy) < 0.01
      ) {
        state.rafId = null;
        return;
      }

      state.rafId = requestAnimationFrame(animate);
    };

    rotStateRef.current.rafId = requestAnimationFrame(animate);
  }, []);

  // Whole-site interactive cursor tracking: center of X-Y keeps symbol straight up (0°)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleGlobalMouseMove = (e) => {
      if (!buttonRef.current || !isVisible) return;

      // Screen center coordinates (center of X-Y)
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;

      // Normalized coordinates from screen center: [-1 to +1], strictly 0 at center of X-Y
      const normScreenX = (e.clientX - screenCenterX) / (screenCenterX || 1);
      const normScreenY = (e.clientY - screenCenterY) / (screenCenterY || 1);

      // Check proximity to the button itself for direct magnetic hover
      const rect = buttonRef.current.getBoundingClientRect();
      const btnCx = rect.left + rect.width / 2;
      const btnCy = rect.top + rect.height / 2;
      const btnDx = e.clientX - btnCx;
      const btnDy = e.clientY - btnCy;
      const distToBtn = Math.hypot(btnDx, btnDy);

      if (distToBtn < 65) {
        // Direct hover on button: magnetic micro-interaction
        const btnNormX = Math.max(-1, Math.min(1, btnDx / (rect.width / 2)));
        const btnNormY = Math.max(-1, Math.min(1, btnDy / (rect.height / 2)));
        rotStateRef.current.isHovered = true;
        rotStateRef.current.targetAngle = btnNormX * 18; // gentle tilt on direct hover
        rotStateRef.current.targetDx = btnNormX;
        rotStateRef.current.targetDy = btnNormY;
      } else {
        // Across the website:
        // At center of X-Y (normScreenX = 0, normScreenY = 0): targetAngle = 0 (100% straight up like real logo!)
        rotStateRef.current.isHovered = false;
        rotStateRef.current.targetAngle = normScreenX * 35; // smooth axial tilt proportional to cursor position
        rotStateRef.current.targetDx = normScreenX;
        rotStateRef.current.targetDy = normScreenY;
      }

      startAnimationLoop();
    };

    const handleMouseLeaveWindow = () => {
      // Smoothly settle upright (0°) like real logo when mouse leaves window
      rotStateRef.current.targetAngle = 0;
      rotStateRef.current.targetDx = 0;
      rotStateRef.current.targetDy = 0;
      rotStateRef.current.isHovered = false;
      startAnimationLoop();
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      if (rotStateRef.current.rafId !== null) {
        cancelAnimationFrame(rotStateRef.current.rafId);
        rotStateRef.current.rafId = null;
      }
    };
  }, [isVisible, startAnimationLoop]);

  // Direct hover handlers as immediate triggers
  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const normX = Math.max(-1, Math.min(1, dx / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, dy / (rect.height / 2)));

    rotStateRef.current.targetAngle = normX * 18;
    rotStateRef.current.targetDx = normX;
    rotStateRef.current.targetDy = normY;
    rotStateRef.current.isHovered = true;

    startAnimationLoop();
  };

  const handleMouseLeave = () => {
    rotStateRef.current.isHovered = false;
    rotStateRef.current.targetAngle = 0;
    rotStateRef.current.targetDx = 0;
    rotStateRef.current.targetDy = 0;
    startAnimationLoop();
  };

  const isAtTopWithReturn = isNearTop && returnPos !== null;

  return (
    <div
      className={`fixed right-3.5 bottom-3.5 sm:right-6 sm:bottom-6 z-40 transition-all duration-350 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={handleScrollClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label={
          isAtTopWithReturn
            ? 'Return to previous reading position'
            : isAtBottom
            ? 'Back to top'
            : `Page scroll progress: ${ariaProgress}% (click to jump to top)`
        }
        title={
          isAtTopWithReturn
            ? 'Return to previous reading position'
            : isAtBottom
            ? 'Back to top'
            : 'Scroll to top (click to jump)'
        }
        className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0B0F17]/95 backdrop-blur-md text-white flex items-center justify-center border border-white/[0.12] shadow-[0_6px_20px_rgba(11,15,23,0.38)] hover:border-[#E69D2B]/60 hover:shadow-[0_8px_24px_rgba(230,157,43,0.28)] active:scale-95 transition-shadow duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E69D2B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F17] group"
        style={{
          transitionProperty: 'border-color, box-shadow',
          transitionDuration: '200ms',
        }}
      >
        {/* =================================================================== */}
        {/* ULTRA-THIN ELEGANT GOLD PROGRESS RING (44px SVG CIRCLE)             */}
        {/* =================================================================== */}
        <svg
          viewBox="0 0 44 44"
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none select-none p-[1.5px]"
        >
          {/* Subtle Neutral Track Circle */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
          />

          {/* Dynamic Gold Progress Arc */}
          <circle
            ref={circleRef}
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke="#E69D2B"
            strokeWidth="1.75"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-75 ease-out"
          />
        </svg>

        {/* =================================================================== */}
        {/* CENTRAL SYMBOL: RETURN DOWN <-> SAHARA EMBLEM <-> BACK-TO-TOP ARROW */}
        {/* =================================================================== */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-2.5 pointer-events-none">
          <AnimatePresence mode="wait">
            {isAtTopWithReturn ? (
              <motion.div
                key="return-to-position-arrow"
                initial={{ opacity: 0, scale: 0.65, y: -2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.65, y: 2 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full h-full flex items-center justify-center text-[#E69D2B]"
              >
                <ArrowDown className="w-4 h-4 stroke-[2.4]" />
              </motion.div>
            ) : isAtBottom ? (
              <motion.div
                key="back-to-top-arrow"
                initial={{ opacity: 0, scale: 0.65, y: 2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.65, y: -2 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full h-full flex items-center justify-center text-[#E69D2B]"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.4]" />
              </motion.div>
            ) : (
              <motion.div
                key="sahara-emblem"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full h-full flex items-center justify-center"
              >
                <div
                  ref={markRef}
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center will-change-transform transition-transform duration-150 ease-out"
                >
                  <img
                    src={saharaMarkImg}
                    alt="Sahara Staffing Inc."
                    className="w-full h-full object-contain filter drop-shadow-[0_1.5px_6px_rgba(230,157,43,0.4)] select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </div>
  );
}
