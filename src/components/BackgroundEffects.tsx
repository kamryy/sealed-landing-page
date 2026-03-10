/**
 * Ambient glow blobs that sit behind the entire page.
 */
export default function BackgroundEffects() {
  return (
    <>
      <div
        className="pointer-events-none absolute -left-34 top-8 h-[clamp(22rem,45vw,40rem)] w-[clamp(8rem,18vw,17.5rem)] -rotate-20 rounded-full bg-sealed-teal/45 blur-[70px]"
        style={{ animation: 'sealedLightPulse 8s ease-in-out infinite' }}
      />
      <div
        className="pointer-events-none absolute -left-2 top-50 h-[clamp(20rem,42vw,40rem)] w-[clamp(2rem,4vw,2.75rem)] -rotate-45 rounded-full bg-sealed-teal/45 blur-[30px]"
        style={{ animation: 'sealedLightPulse 10s ease-in-out infinite 2s' }}
      />

      <div
        className="pointer-events-none absolute -right-70 top-1380 lg:top-1200 h-[clamp(22rem,45vw,40rem)] w-[clamp(8rem,18vw,17.5rem)] -rotate-100 rounded-full bg-sealed-teal/45 blur-[70px]"
        style={{ animation: 'sealedLightPulse 8s ease-in-out infinite' }}
      />
      <div
        className="pointer-events-none absolute -right-2 top-1400 lg:top-1230 h-[clamp(20rem,42vw,40rem)] w-[clamp(2rem,4vw,2.75rem)] -rotate-147 rounded-full bg-sealed-teal/45 blur-[30px]"
        style={{ animation: 'sealedLightPulse 10s ease-in-out infinite 2s' }}
      />

      <div
        className="pointer-events-none absolute -left-40 top-1720 lg:top-1560 lg:-left-20 h-[clamp(50rem,35vw,70rem)] w-[clamp(8rem,18vw,12.5rem)] -rotate-10 rounded-full bg-sealed-teal/45 blur-[70px]"
        style={{ animation: 'sealedLightPulse 8s ease-in-out infinite' }}
      />
      <div
        className="pointer-events-none absolute -left-2 top-1740 lg:top-1600 h-[clamp(20rem,42vw,40rem)] w-[clamp(2rem,4vw,2.75rem)] -rotate-17 rounded-full bg-sealed-teal/45 blur-[30px]"
        style={{ animation: 'sealedLightPulse 10s ease-in-out infinite 2s' }}
      />
    </>
  );
}
