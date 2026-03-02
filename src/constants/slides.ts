export interface Slide {
  heading: string;
  subheading: string;
  cardTitle: string;
  cardDescription: string;
  icon: 'privacy' | 'secure';
}

/**
 * Unique slide definitions. The carousel cycles through these.
 * Previously duplicated 5× — now kept DRY and repeated programmatically.
 */
const UNIQUE_SLIDES: Slide[] = [
  {
    heading: 'Serverless Communication',
    subheading:
      'Sealed uses advanced cryptography to ensure fully private communication that never passes through any server.',
    cardTitle: 'Communication Only You Can Read',
    cardDescription:
      'Sealed is built on strong cryptographic technology that guarantees end-to-end security without relying on centralized servers. Messages are exchanged directly between users, and the system is designed so that even the developers have no technical ability to view or intercept them.',
    icon: 'privacy',
  },
  {
    heading: 'Another Headline',
    subheading:
      'Infrastructure that works peer-to-peer, preventing anyone — including the creators — from accessing your data.',
    cardTitle: 'Secure Communication',
    cardDescription:
      'Sealed relies on advanced encryption methods to ensure full end-to-end protection without the use of central infrastructure. Communication happens peer-to-peer, and the architecture prevents anyone — including the creators — from accessing or monitoring the content of messages.',
    icon: 'secure',
  },
];

/** Full slide list used by the carousel (repeats the two unique slides). */
export const SLIDES: Slide[] = [
  UNIQUE_SLIDES[0],
  UNIQUE_SLIDES[1],
  UNIQUE_SLIDES[0],
  UNIQUE_SLIDES[1],
  UNIQUE_SLIDES[0],
];

export const STEP_COUNT = SLIDES.length;
export const MAX_ROTATION = 360;
export const STEP_ANGLE = MAX_ROTATION / STEP_COUNT;

export const ROTATIONS = Array.from(
  { length: STEP_COUNT },
  (_, i) => STEP_ANGLE * i
);

export const ARC_CENTER = { x: 450, y: 450 } as const;
export const ORBIT_RADIUS = 430;
export const BASE_TOP_ANGLE = -90;
