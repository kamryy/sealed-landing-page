import { ARC_CENTER, ORBIT_RADIUS } from '@/constants/slides';

/** Returns (x, y) on the circular orbit for a given angle in degrees. */
export function pointOnOrbit(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: ARC_CENTER.x + ORBIT_RADIUS * Math.cos(rad),
    y: ARC_CENTER.y + ORBIT_RADIUS * Math.sin(rad),
  };
}
