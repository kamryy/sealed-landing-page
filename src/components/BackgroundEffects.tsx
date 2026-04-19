/**
 * Ambient glow blobs scattered down the page.
 *
 * Absolutely positioned against the `<main>` element so they scroll with
 * content instead of being pinned to the viewport. One sits near the
 * hero area, and three more are spread across the lower sections to
 * keep the atmospheric glow going the whole way down.
 *
 * Sits behind everything via `-z-10`.
 */
export default function BackgroundEffects() {
  const blobs = [
    {
      // Hero / Section One area, left side
      className:
        'left-[-10rem] top-[6vh] h-[clamp(20rem,45vh,36rem)] w-[clamp(10rem,18vw,16rem)] -rotate-20 bg-sealed-teal/35',
      delay: '0s',
      duration: '10s',
    },
    {
      // Around Section Two / Three, right side
      className:
        'right-[-10rem] top-[190vh] h-[clamp(18rem,40vh,32rem)] w-[clamp(11rem,20vw,18rem)] rotate-[100deg] bg-sealed-teal/30',
      delay: '2s',
      duration: '12s',
    },
    {
      // Around Section Four / Five, left side
      className:
        'left-[-10rem] top-[320vh] h-[clamp(18rem,42vh,32rem)] w-[clamp(10rem,18vw,16rem)] -rotate-12 bg-sealed-teal/26',
      delay: '4s',
      duration: '11s',
    },
    {
      // Whitelist / footer area, right side
      className:
        'right-[-10rem] top-[450vh] h-[clamp(18rem,42vh,30rem)] w-[clamp(11rem,18vw,16rem)] rotate-[110deg] bg-sealed-teal/22',
      delay: '5s',
      duration: '14s',
    },
  ];

  return (
    <>
      {blobs.map((blob, i) => (
        <div
          key={i}
          aria-hidden
          className={`pointer-events-none absolute -z-10 rounded-full blur-[60px] will-change-[opacity] ${blob.className}`}
          style={{
            animation: `sealedLightPulse ${blob.duration} ease-in-out infinite ${blob.delay}`,
          }}
        />
      ))}
    </>
  );
}
