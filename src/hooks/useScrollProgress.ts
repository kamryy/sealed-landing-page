'use client';

import { RefObject, useEffect } from 'react';

/**
 * Drives a per-frame scroll-progress callback for a pinned-sticky wrapper.
 *
 * Given a tall wrapper element whose child is `position: sticky; top: var(--nav-h)`,
 * progress is how far the wrapper has been scrolled through the sticky zone:
 *   - 0 when the wrapper's top edge reaches the sticky anchor
 *   - 1 when the wrapper's bottom edge is one viewport-height above that anchor
 *
 * The callback is rAF-throttled and only fires while the wrapper is near the viewport.
 * No React state is touched — callers mutate the DOM or call `setState` themselves
 * when they want a re-render.
 */
export function useScrollProgress(
  wrapperRef: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void
) {
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let rafId = 0;
    let latest = 0;

    const compute = () => {
      rafId = 0;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const scrubRange = rect.height - viewport;
      if (scrubRange <= 0) {
        onProgress(0);
        return;
      }

      // How far the wrapper's top has moved past the viewport's top.
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrubRange));

      if (progress !== latest) {
        latest = progress;
        onProgress(progress);
      }
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [wrapperRef, onProgress]);
}
