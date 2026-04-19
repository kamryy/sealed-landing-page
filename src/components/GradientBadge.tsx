import type { ReactNode } from 'react';

interface GradientBadgeProps {
  children: ReactNode;
}

/**
 * Pill-shaped badge with the Sealed signature gradient border.
 * Re-used across the hero and zero-trace sections.
 */
export default function GradientBadge({ children }: GradientBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-md text-white/90"
      style={{
        backgroundImage: [
          'linear-gradient(93.5866deg, rgba(107,250,214,0.15) 18.598%, rgba(202,115,68,0.1) 96.15%)',
          'linear-gradient(90deg, rgb(0,0,0) 0%, rgb(0,0,0) 100%)',
          'linear-gradient(93.5866deg, rgba(107,250,214,1) 18.598%, rgba(202,115,68,1) 96.15%)',
        ].join(', '),
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, padding-box, border-box',
      }}
    >
      {children}
    </div>
  );
}
