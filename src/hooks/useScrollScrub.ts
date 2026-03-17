'use client';

import { useEffect, useRef, useState } from 'react';

import { ROTATIONS, STEP_ANGLE, STEP_COUNT } from '@/constants/slides';

interface ScrollScrubState {
  currentStep: number;
  animatedRotation: number;
  animationProgress: number;
}

/**
 * Custom hook that scrubs through N carousel steps as the user scrolls
 * past a pinned section. Handles wheel, touch, and scroll-lock.
 */
export function useScrollScrub(
  sectionRef: React.RefObject<HTMLElement | null>,
  arcContainerRef: React.RefObject<HTMLDivElement | null>,
  featureCardRef: React.RefObject<HTMLDivElement | null>,
  isMobile: boolean
): ScrollScrubState {
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const rafIdRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const snappedStepRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const hasCompletedReverseRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const hasSnappedRef = useRef(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [animatedRotation, setAnimatedRotation] = useState(ROTATIONS[0]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isScrollLocked, setIsScrollLocked] = useState(false);

  // ── Reset on mobile ───────────────────────────────────────────────
  useEffect(() => {
    if (isMobile) {
      setCurrentStep(0);
      setAnimatedRotation(ROTATIONS[0]);
      setAnimationProgress(0);
      progressRef.current = 0;
      snappedStepRef.current = null;
      setIsScrollLocked(false);
      return;
    }

    const totalTransitions = STEP_COUNT - 1;
    const CARD_VISIBILITY_TOLERANCE_PX = 20;
    const SCRUB_START_BOTTOM_OFFSET_PX = 0;
    const DWELL_WINDOW = 0.1; // how close to a step the progress must be to "snap" to it
    const DWELL_RELEASE_WINDOW = 0.1; // how far from the snapped step the progress must be to release it

    /* ──── helpers ──────────────────────────────────────────────── */

    const getSectionLockState = () => {
      const sectionEl = sectionRef.current;
      const cardEl = featureCardRef.current;
      if (!sectionEl || !cardEl)
        return {
          canScrub: false,
          beforeLockStart: true,
          afterLockEnd: false,
        };

      const sectionRect = sectionEl.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();
      const cardFullyVisible =
        cardRect.top >= CARD_VISIBILITY_TOLERANCE_PX &&
        cardRect.bottom <=
          window.innerHeight -
            CARD_VISIBILITY_TOLERANCE_PX -
            SCRUB_START_BOTTOM_OFFSET_PX;

      return {
        canScrub: cardFullyVisible,
        beforeLockStart: !cardFullyVisible,
        afterLockEnd: sectionRect.bottom < window.innerHeight,
      };
    };

    const applyProgress = (next: number) => {
      const clamped = Math.max(0, Math.min(1, next));
      progressRef.current = clamped;
      targetProgressRef.current = clamped;

      const continuousRaw = clamped * totalTransitions;
      const nearestStep = Math.round(continuousRaw);

      if (
        snappedStepRef.current == null &&
        Math.abs(continuousRaw - nearestStep) <= DWELL_WINDOW / 2
      ) {
        snappedStepRef.current = nearestStep;
      }

      if (snappedStepRef.current != null) {
        const snapped = snappedStepRef.current;
        if (
          continuousRaw < snapped - DWELL_RELEASE_WINDOW / 2 ||
          continuousRaw > snapped + DWELL_RELEASE_WINDOW / 2
        ) {
          snappedStepRef.current = null;
        }
      }

      const continuous =
        snappedStepRef.current != null ? snappedStepRef.current : continuousRaw;
      const idx = Math.min(Math.floor(continuous), totalTransitions);
      const stepProg = idx === totalTransitions ? 1 : continuous - idx;

      setCurrentStep(idx);
      setAnimatedRotation(continuous * STEP_ANGLE);
      setAnimationProgress(stepProg);
      // Mark reverse-scrub complete when progress reaches 0 from above
      if (clamped === 0 && !hasCompletedReverseRef.current) {
        hasCompletedReverseRef.current = true;
      }
      // Clear the flag once we start scrubbing forward again
      if (clamped > 0) {
        hasCompletedReverseRef.current = false;
      }
      // Keep scroll locked during active scrub, and also at progress=1
      // when reverse-scrub hasn't completed (arriving from below).
      const shouldLock =
        (clamped > 0 && clamped < 1) ||
        (clamped === 1 && !hasCompletedReverseRef.current);
      setIsScrollLocked(shouldLock);
    };

    const doAutoSnap = (scrollingDown: boolean) => {
      if (isAutoScrollingRef.current || hasSnappedRef.current) return;

      const sectionEl = sectionRef.current;
      const cardEl = featureCardRef.current;
      if (!sectionEl || !cardEl) return;

      const sectionRect = sectionEl.getBoundingClientRect();
      const targetScrollY = window.scrollY + sectionRect.top + 300;

      hasSnappedRef.current = true;
      isAutoScrollingRef.current = true;

      // Coming from below: set progress to 1 for reverse scrub
      if (!scrollingDown && progressRef.current < 1) {
        applyProgress(1);
      }

      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });

      let frames = 0;
      const checkDone = () => {
        frames++;
        if (Math.abs(window.scrollY - targetScrollY) < 2 || frames > 120) {
          isAutoScrollingRef.current = false;
          lastScrollYRef.current = window.scrollY;
          // After auto-snap from below, lock scroll so wheel events
          // drive the reverse scrub instead of scrolling the page.
          if (!scrollingDown && progressRef.current >= 1) {
            setIsScrollLocked(true);
          }
          return;
        }
        requestAnimationFrame(checkDone);
      };
      requestAnimationFrame(checkDone);
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      const scrollingUp = scrollY < lastScrollYRef.current;
      const scrollingDown = scrollY > lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      // Don't interfere while auto-scrolling
      if (isAutoScrollingRef.current) return;

      const sectionEl = sectionRef.current;
      if (sectionEl) {
        const sectionRect = sectionEl.getBoundingClientRect();
        const vh = window.innerHeight;

        // Reset snap flag when section is fully out of view
        if (sectionRect.bottom < -200 || sectionRect.top > vh + 200) {
          hasSnappedRef.current = false;
        }

        // Auto-snap zone: section is partially in view but card not yet positioned
        if (!hasSnappedRef.current && !hasCompletedReverseRef.current) {
          if (scrollingDown && progressRef.current === 0) {
            // Coming from top: snap when section top enters upper 70% of viewport
            if (sectionRect.top < vh * 0.7 && sectionRect.top > -100) {
              doAutoSnap(true);
              return;
            }
          }
          if (scrollingUp) {
            // Coming from bottom: snap when section bottom enters lower 70% of viewport
            if (
              sectionRect.bottom > vh * 0.3 &&
              sectionRect.bottom < vh + 100
            ) {
              doAutoSnap(false);
              return;
            }
          }
        }
      }

      const state = getSectionLockState();

      if (state.afterLockEnd) {
        if (!hasCompletedReverseRef.current) {
          if (progressRef.current !== 1) applyProgress(1);
        }
        setIsScrollLocked(false);
        return;
      }

      if (state.canScrub) {
        // Re-entering from below while scrolling up: lock to allow reverse scrubbing
        if (
          scrollingUp &&
          progressRef.current >= 1 &&
          !hasCompletedReverseRef.current
        ) {
          setIsScrollLocked(true);
          return;
        }
        // Already mid-scrub: keep locked
        if (progressRef.current > 0 && progressRef.current < 1) {
          setIsScrollLocked(true);
          return;
        }
        // Progress is 0 and scrolling up — don't lock, let page scroll normally
        return;
      }

      // Card not fully visible, not past section end.
      // If not actively scrolling down and progress is past halfway,
      // don't reset — wait for the sticky card to re-engage.
      // (Using !scrollingDown instead of scrollingUp so that ambiguous
      // scroll events after smooth-scroll auto-snap don't reset progress.)
      if (!scrollingDown && progressRef.current > 0.5) {
        return;
      }

      if (progressRef.current !== 0) applyProgress(0);
      // User has scrolled away from the section — clear the reverse flag
      hasCompletedReverseRef.current = false;
      setIsScrollLocked(false);
    };

    const isOverDarkOverlay = (clientY: number) => {
      const el = arcContainerRef.current;
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        clientY >= rect.top + rect.height &&
        clientY <= rect.top + 2 * rect.height
      );
    };

    const onWheel = (e: WheelEvent) => {
      if (isOverDarkOverlay(e.clientY)) {
        console.log('[scrub] blocked: over dark overlay', e.clientY);
        setIsScrollLocked(false);
        return;
      }

      const state = getSectionLockState();
      console.log('[scrub] onWheel', {
        canScrub: state.canScrub,
        progress: progressRef.current,
        deltaY: e.deltaY,
        deltaMode: e.deltaMode,
      });
      if (!state.canScrub) {
        setIsScrollLocked(false);
        return;
      }

      // At the start scrolling up — let the page scroll normally
      if (progressRef.current <= 0 && e.deltaY < 0) {
        setIsScrollLocked(false);
        return;
      }

      // Normalize deltaY across deltaMode units so physical mice (line/page
      // mode) behave the same as trackpads (pixel mode).
      const pixelY =
        e.deltaMode === 2
          ? e.deltaY * window.innerHeight // page → px
          : e.deltaMode === 1
            ? e.deltaY * 32 // line → px (browsers use ~32 px/line)
            : e.deltaY; // already px
      const rawDelta = pixelY * 0.0007;
      const nextTarget = Math.max(
        0,
        Math.min(1, targetProgressRef.current + rawDelta)
      );

      const leavingStart = nextTarget <= 0 && e.deltaY < 0;
      const leavingEnd = nextTarget >= 1 && e.deltaY > 0;

      if (leavingStart || leavingEnd) {
        targetProgressRef.current = Math.max(0, Math.min(1, nextTarget));
        setIsScrollLocked(false);
        return;
      }

      e.preventDefault();
      targetProgressRef.current = nextTarget;
      setIsScrollLocked(true);

      // Start the animation loop if not already running
      if (!rafIdRef.current) {
        const animate = () => {
          const current = progressRef.current;
          const target = targetProgressRef.current;
          const diff = target - current;

          // Lerp speed: move 8% of the remaining distance each frame
          // Min step prevents getting stuck at tiny fractional differences
          const LERP_SPEED = 0.14;
          const MIN_STEP = 0.004;

          if (Math.abs(diff) < MIN_STEP) {
            applyProgress(target);
            rafIdRef.current = 0;
            return;
          }

          const step =
            Math.sign(diff) * Math.max(Math.abs(diff) * LERP_SPEED, MIN_STEP);
          applyProgress(current + step);
          rafIdRef.current = requestAnimationFrame(animate);
        };
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const state = getSectionLockState();
      if (!state.canScrub) {
        setIsScrollLocked(false);
        return;
      }

      const startY = touchStartYRef.current;
      const currentY = e.touches[0]?.clientY;
      if (startY == null || currentY == null) return;

      const delta = (startY - currentY) * 0.0024;
      const next = Math.max(0, Math.min(1, progressRef.current + delta));

      if (next !== progressRef.current) {
        e.preventDefault();
        touchStartYRef.current = currentY;
        applyProgress(next);
      }
    };

    /* ──── attach ───────────────────────────────────────────────── */
    lastScrollYRef.current = window.scrollY;
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
      setIsScrollLocked(false);
    };
  }, [isMobile, sectionRef, arcContainerRef, featureCardRef]);

  // ── Body scroll-lock ──────────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return;

    document.body.style.overflow = isScrollLocked ? 'hidden' : '';
    document.body.style.touchAction = isScrollLocked ? 'none' : '';

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobile, isScrollLocked]);

  return { currentStep, animatedRotation, animationProgress };
}
