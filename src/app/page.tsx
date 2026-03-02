import DevComingSoonGate from '@/components/DevComingSoonGate';
import FullLandingPage from '@/components/FullLandingPage';
import { cookies } from 'next/headers';

export default async function Home() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!isDevelopment) {
    return <FullLandingPage />;
  }

  const cookieStore = await cookies();
  const hasDevAccess =
    cookieStore.get('sealed-dev-access')?.value === 'granted';

  if (hasDevAccess) {
    return <FullLandingPage />;
  }

  return <DevComingSoonGate />;
}
