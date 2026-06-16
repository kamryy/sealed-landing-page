import { cookies } from "next/headers";

import DevComingSoonGate from "@/components/gates/DevComingSoonGate";

// Server-side gate: the top-up flow is hidden behind the dev password until
// launch. Without a valid sealed-dev-access cookie, the route renders the
// Coming Soon gate (which carries the unlock form) instead of the page.
export default async function TopUpWalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unlocked =
    (await cookies()).get("sealed-dev-access")?.value === "granted";

  if (!unlocked) return <DevComingSoonGate />;

  return <>{children}</>;
}
