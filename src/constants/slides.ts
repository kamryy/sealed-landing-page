import type { SlideIconType } from '@/components/ui/icons';

export interface Slide {
  heading: string;
  subheading: string;
  cardTitle: string;
  cardDescription: string;
  icon: SlideIconType;
}

export const SLIDES: Slide[] = [
  {
    heading: 'Serverless Communication',
    subheading: 'No middleman. No server. Just you and your receiver.',
    cardTitle: 'Serverless Communication',
    cardDescription:
      'Sealed sends messages directly between users with no middleman and no server in between. Your conversations stay between you and your receiver — no one else.',
    icon: 'serverless',
  },
  {
    heading: 'Sealed Messaging',
    subheading:
      'End-to-End Encryption standard. Ephemeral layers on demand. Stealth routing on every send.',
    cardTitle: 'Sealed Messaging',
    cardDescription:
      'End-to-End Encryption is the standard for all messages. Activate the Ephemeral Layer whenever you need it, and Stealth Message Routing kicks in every time you click send.',
    icon: 'messaging',
  },
  {
    heading: 'Quantum Resistant Protection',
    subheading:
      'Resistant to super computing. Protecting sensitive communication against future threats.',
    cardTitle: 'Quantum Resistant Protection',
    cardDescription:
      'Built to resist super computing power, Sealed protects your sensitive communication against future quantum solutions — keeping your data safe today and tomorrow.',
    icon: 'quantum',
  },
  {
    heading: 'No Identity',
    subheading: 'No phone number. No email. No name. Use your wallet.',
    cardTitle: 'No Identity',
    cardDescription:
      'No phone number, no email, no name required. Just connect your wallet and start communicating — fully anonymous from the start.',
    icon: 'wallet',
  },
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
