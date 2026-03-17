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
  const touchStartYRef = useRef<number | null>(null);
  const snappedStepRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);

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
    const CARD_VISIBILITY_TOLERANCE_PX = 4;
    const SCRUB_START_BOTTOM_OFFSET_PX = 0;
    const DWELL_WINDOW = 0.1; // how close to a step the progress must be to "snap" to it
    const DWELL_RELEASE_WINDOW = 0.1; // how far from the snapped step the progress must be to release it

    /* ──── helpers ──────────────────────────────────────────────── */

    const getSectionLockState = () => {
      const sectionEl = sectionRef.current;
      const cardEl = featureCardRef.current;
      if (!sectionEl || !cardEl)
        return { canScrub: false, beforeLockStart: true, afterLockEnd: false };

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
      setIsScrollLocked(clamped > 0 && clamped < 1);
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      const scrollingUp = scrollY < lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      const state = getSectionLockState();

      if (state.afterLockEnd) {
        if (progressRef.current !== 1) applyProgress(1);
        setIsScrollLocked(false);
        return;
      }

      if (state.canScrub) {
        // Re-entering from below while scrolling up: lock to allow reverse scrubbing
        if (scrollingUp && progressRef.current >= 1) {
          setIsScrollLocked(true);
          return;
        }
        // Already mid-scrub: keep locked
        if (progressRef.current > 0 && progressRef.current < 1) {
          setIsScrollLocked(true);
          return;
        }
        return;
      }

      // Card not fully visible, not past section end.
      // If scrolling up with progress near end, don't reset — wait for sticky to re-engage.
      if (scrollingUp && progressRef.current > 0.5) {
        return;
      }

      if (progressRef.current !== 0) applyProgress(0);
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

      // Normalize deltaY across deltaMode units so physical mice (line/page
      // mode) behave the same as trackpads (pixel mode).
      const pixelY =
        e.deltaMode === 2
          ? e.deltaY * window.innerHeight // page → px
          : e.deltaMode === 1
            ? e.deltaY * 32 // line → px (browsers use ~32 px/line)
            : e.deltaY; // already px
      const delta = pixelY * 0.0014;
      const next = Math.max(0, Math.min(1, progressRef.current + delta));

      if (next !== progressRef.current) {
        e.preventDefault();
        applyProgress(next);
        return;
      }

      const leavingStart = progressRef.current <= 0 && e.deltaY < 0;
      const leavingEnd = progressRef.current >= 1 && e.deltaY > 0;
      setIsScrollLocked(!(leavingStart || leavingEnd));
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
