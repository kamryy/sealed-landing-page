import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Sealed',
  description:
    'Privacy policy for Sealed, the blockchain-based end-to-end encrypted private messaging application.',
};

/* ─── tiny reusable pieces ─── */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-sealed-teal/20 bg-sealed-teal/5 px-3 py-1 text-xs font-medium tracking-wide text-sealed-teal">
      {children}
    </span>
  );
}

function SectionHeading({
  id,
  number,
  children,
}: {
  id?: string;
  number: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mt-16 mb-4 flex items-center gap-3 text-2xl font-semibold text-white sm:text-3xl"
    >
      <span className="font-mono text-base font-normal text-sealed-teal/60">
        {number}
      </span>
      {children}
    </h2>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/6">
      <table className="w-full min-w-120 text-sm">
        <thead>
          <tr className="border-b border-white/6 bg-white/2">
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-sealed-teal/80"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-white/4 last:border-none"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-5 py-3 text-[#b3b3b3]"
                  dangerouslySetInnerHTML={{ __html: cell }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── page ─── */

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(107,250,214,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── top bar ── */}
      <header className="sticky top-0 z-50 border-b border-white/6 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/sealed-logo.svg"
              alt="Sealed"
              width={28}
              height={29}
            />
            <span className="text-lg font-bold tracking-wide text-white">
              Sealed
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[#b3b3b3] transition-colors hover:text-white"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      {/* ── content ── */}
      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* hero */}
        <div className="mb-12 text-center">
          <Badge>Legal</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-[#888]">
            Effective Date: March 14, 2026 &middot; App&nbsp;Version 1.0.9+ &middot;
            iOS&nbsp;&middot;&nbsp;Android
          </p>
        </div>

        <div className="prose-policy space-y-6 text-[15px] leading-relaxed text-[#b3b3b3]">
          {/* ── 1 ── */}
          <SectionHeading id="overview" number="01">
            Overview
          </SectionHeading>
          <p>
            Sealed is a blockchain-based, end-to-end encrypted private messaging
            application. This policy explains what data is collected, where it
            lives, who controls it, and what rights you have.
          </p>
          <p>
            A foundational principle of Sealed&apos;s architecture is that{' '}
            <strong className="text-white">
              no single party has full control over all your data
            </strong>
            . Depending on where data lives, the controller is different — and
            in some cases it is you, the user, alone. We explain each data
            category explicitly below.
          </p>

          {/* ── 2 ── */}
          <SectionHeading id="who-we-are" number="02">
            Who We Are
          </SectionHeading>
          <p>
            &ldquo;Sealed&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, and
            &ldquo;our&rdquo; refers to the operator of the Sealed indexer
            service and application.
          </p>
          <p>
            For the purposes of applicable data protection law, we act as the{' '}
            <strong className="text-white">
              data controller only for the data stored on infrastructure we
              operate
            </strong>{' '}
            (the indexer server). We are <em>not</em> the controller of data
            that exists only on your device or data written to a public
            blockchain — that distinction is critical and explained in full
            below.
          </p>

          {/* ── 3 ── */}
          <SectionHeading id="three-realms" number="03">
            The Three Data Realms — Who Controls What
          </SectionHeading>
          <p>
            Understanding Sealed requires understanding that your data exists in
            up to three distinct realms, each with a different controller:
          </p>

          {/* Realm A */}
          <h3 className="mt-10 mb-2 text-lg font-semibold text-sealed-teal">
            Realm A — Your Device{' '}
            <span className="text-sm font-normal text-[#888]">
              (You are the sole controller)
            </span>
          </h3>
          <p>
            The following data{' '}
            <strong className="text-white">
              never leaves your device in unencrypted form
            </strong>{' '}
            and is stored in your device&apos;s secure enclave (iOS Keychain or
            Android Keystore):
          </p>
          <DataTable
            headers={['Data', 'Storage Location']}
            rows={[
              [
                '12-word BIP39 mnemonic (seed phrase)',
                'Device secure storage only',
              ],
              [
                'Ed25519 wallet signing keypair (private key)',
                'Device secure storage only',
              ],
              [
                'X25519 encryption keypair (private key)',
                'Device secure storage only',
              ],
              [
                'Message plaintext / decrypted conversations',
                'Local SQLite database on-device',
              ],
              [
                'Contact list (wallet addresses + usernames)',
                'Local SQLite database on-device',
              ],
            ]}
          />
          <div className="rounded-xl border border-sealed-teal/10 bg-sealed-teal/3 px-5 py-4 text-sm text-[#b3b3b3]">
            <strong className="text-white">We have zero access to this data.</strong>{' '}
            If you lose your device and your seed phrase backup, there is no
            recovery mechanism — no one can restore access on your behalf. You
            are the sole custodian.
          </div>

          {/* Realm B */}
          <h3 className="mt-10 mb-2 text-lg font-semibold text-sealed-teal">
            Realm B — The Public Blockchain{' '}
            <span className="text-sm font-normal text-[#888]">
              (No one is the controller)
            </span>
          </h3>
          <p>
            Every message sent through Sealed is transmitted as a transaction on
            a public blockchain (currently Algorand TestNet; previously Solana
            devnet). By design, this data is:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong className="text-white">Public</strong> — visible to
              anyone with access to the ledger
            </li>
            <li>
              <strong className="text-white">Permanent</strong> — blockchain
              transactions are immutable; they cannot be deleted by you, by us,
              or by anyone
            </li>
            <li>
              <strong className="text-white">Pseudonymous</strong> — tied to
              your wallet address, not your name or phone number
            </li>
          </ul>
          <DataTable
            headers={['Data', 'Description']}
            rows={[
              [
                'Encrypted message ciphertext',
                'AES-256-GCM ciphertext; content is unreadable without your private key',
              ],
              [
                'Ephemeral sender public key',
                'One-time X25519 public key per message, not your permanent identity key',
              ],
              [
                'Recipient tag',
                'A 32-byte HMAC used for stealth addressing; does not directly identify you',
              ],
              ['Transaction timestamp', 'Block-level timestamp'],
              [
                'Sender wallet public key',
                'Your public wallet address (pseudonymous identity)',
              ],
              [
                'Optional username',
                'If you register a human-readable username, it is written to the blockchain permanently',
              ],
            ]}
          />
          <div className="rounded-xl border border-amber-500/10 bg-amber-500/3 px-5 py-4 text-sm text-[#b3b3b3]">
            <strong className="text-white">
              Because blockchain data is permanent and publicly accessible, no
              right of deletion or correction applies to on-chain data.
            </strong>{' '}
            You should treat any information you choose to commit to the
            blockchain as irreversibly public (albeit encrypted where
            applicable).
          </div>

          {/* Realm C */}
          <h3 className="mt-10 mb-2 text-lg font-semibold text-sealed-teal">
            Realm C — Our Indexer Server{' '}
            <span className="text-sm font-normal text-[#888]">
              (We are the data controller)
            </span>
          </h3>
          <p>
            To provide real-time notifications and efficient message delivery, we
            operate an indexer service. This server stores the following data
            about you:
          </p>
          <DataTable
            headers={['Data', 'Purpose', 'Retention']}
            rows={[
              [
                'Wallet public address',
                'User identity and authentication',
                'Until account deletion or 90 days of inactivity',
              ],
              [
                'X25519 view (scan) private key',
                'Allows the indexer to detect incoming messages addressed to you — <strong class="text-white">without reading message content</strong>',
                'Until account deletion or 90 days of inactivity',
              ],
              [
                'SHA-256 hash of view key',
                'Lookup index',
                'Same as above',
              ],
              [
                'Firebase Cloud Messaging (FCM) token',
                'Push notification delivery',
                'Until account deletion, token refresh, or 90 days of inactivity',
              ],
              [
                'Device platform (<code>ios</code> / <code>android</code>)',
                'Notification routing',
                'Same as FCM token',
              ],
              [
                'Username (if registered)',
                'Human-readable identity',
                'Until account deletion',
              ],
              [
                'Message metadata pointers',
                'Blockchain transaction references used for sync; <strong class="text-white">not message content</strong>',
                '30 days',
              ],
              [
                'Last seen timestamp',
                'Service quality and inactivity cleanup',
                '90 days',
              ],
              [
                'IP address',
                'Rate limiting and operational logging',
                'Server logs rotated per standard practice (typically 7–30 days)',
              ],
            ]}
          />
          <div className="rounded-xl border border-sealed-teal/10 bg-sealed-teal/3 px-5 py-4 text-sm text-[#b3b3b3]">
            <strong className="text-white">Regarding the view key:</strong> This
            is the most significant privacy trade-off in the architecture. Your
            X25519 scan/view private key is shared with our indexer so it can
            recognise messages addressed to you on-chain and deliver push
            notifications.{' '}
            <strong className="text-white">
              The view key does not allow us to decrypt message content.
            </strong>{' '}
            Content encryption uses a separate key path. The view key allows us
            only to determine that a message was sent to you, not what it says.
          </div>

          {/* ── 4 ── */}
          <SectionHeading id="authentication" number="04">
            Authentication
          </SectionHeading>
          <p>
            Sealed uses{' '}
            <strong className="text-white">
              wallet-based authentication only
            </strong>
            . There is no email address, phone number, or password associated
            with your account. When authenticating to our indexer API, your app
            signs a time-limited challenge string with your Ed25519 wallet private
            key — the signing key never leaves your device.
          </p>

          {/* ── 5 ── */}
          <SectionHeading id="data-not-collected" number="05">
            Data We Do Not Collect
          </SectionHeading>
          <p>We explicitly do not collect:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Your real name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Contacts from your device address book</li>
            <li>Location data</li>
            <li>Device advertising identifiers (IDFA / GAID)</li>
            <li>Biometric data</li>
            <li>Analytics or behavioural tracking data</li>
            <li>
              Crash reports or telemetry beyond server-side operational logs
            </li>
          </ul>

          {/* ── 6 ── */}
          <SectionHeading id="third-parties" number="06">
            Third-Party Data Processors
          </SectionHeading>
          <p>
            We use one external third-party service that processes your personal
            data:
          </p>

          <h4 className="mt-6 mb-1 text-base font-semibold text-white">
            Google Firebase (Firebase Cloud Messaging)
          </h4>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong className="text-white">Purpose:</strong> Delivering push
              notification alerts when a new message is addressed to you
            </li>
            <li>
              <strong className="text-white">Data shared with Google:</strong>{' '}
              Your FCM device token and notification payload. Notification
              payloads contain only the sender&apos;s wallet address and a
              message reference —{' '}
              <strong className="text-white">not message content</strong>
            </li>
            <li>
              <strong className="text-white">
                Google&apos;s privacy policy:
              </strong>{' '}
              <a
                href="https://policies.google.com/privacy"
                className="text-sealed-teal underline underline-offset-2 hover:text-sealed-teal-70"
                target="_blank"
                rel="noopener noreferrer"
              >
                policies.google.com/privacy
              </a>
            </li>
            <li>
              <strong className="text-white">Google&apos;s role:</strong>{' '}
              Independent data processor; FCM token data is subject to
              Google&apos;s terms
            </li>
          </ul>

          <h4 className="mt-6 mb-1 text-base font-semibold text-white">
            Public Blockchain RPC Endpoints
          </h4>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong className="text-white">AlgoNode</strong>{' '}
              (<code className="text-xs text-sealed-teal/80">
                testnet-api.algonode.cloud
              </code>
              ) — public Algorand node operated by a third party. Transactions
              you broadcast are by nature globally visible. No personal
              identifying data beyond your wallet address and message ciphertext
              is transmitted.
            </li>
          </ul>
          <p>
            No advertising networks, analytics platforms, data brokers, or any
            other third parties receive your data.
          </p>

          {/* ── 7 ── */}
          <SectionHeading id="data-use" number="07">
            How We Use Your Data
          </SectionHeading>
          <p>
            Data we hold on our indexer server is used exclusively for:
          </p>
          <ol className="list-decimal space-y-1 pl-6">
            <li>
              <strong className="text-white">
                Delivering push notifications
              </strong>{' '}
              — detecting new messages addressed to you and alerting your device
            </li>
            <li>
              <strong className="text-white">Message sync</strong> — helping
              your app efficiently retrieve relevant on-chain messages after
              periods offline
            </li>
            <li>
              <strong className="text-white">
                Rate limiting and abuse prevention
              </strong>{' '}
              — protecting the service from excessive API requests
            </li>
            <li>
              <strong className="text-white">Service operation</strong> —
              standard logging for diagnosing failures
            </li>
          </ol>
          <p>
            We do not sell, rent, or share your data with any third party for
            commercial purposes.
          </p>

          {/* ── 8 ── */}
          <SectionHeading id="retention" number="08">
            Data Retention and Deletion
          </SectionHeading>
          <DataTable
            headers={['Data Type', 'Automatic Retention Policy']}
            rows={[
              [
                'Indexer message metadata',
                'Deleted after <strong class="text-white">30 days</strong>',
              ],
              [
                'User account (view key, FCM token)',
                'Deleted after <strong class="text-white">90 days of inactivity</strong>',
              ],
              [
                'Server IP logs',
                'Rotated per operational practice',
              ],
              [
                'Blockchain data',
                '<strong class="text-white">Permanent</strong> — cannot be deleted',
              ],
              [
                'Device data',
                'Controlled entirely by you; deleting the app removes local data',
              ],
            ]}
          />
          <p>
            <strong className="text-white">Account deletion:</strong> You may
            request deletion of all data we hold on our indexer by sending a
            signed deletion request via the app settings. We will delete your
            view key, FCM token, and all associated metadata within 30 days.
            This does not affect blockchain data.
          </p>

          {/* ── 9 ── */}
          <SectionHeading id="security" number="09">
            Security
          </SectionHeading>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              All message content is encrypted end-to-end using AES-256-GCM with
              per-message ephemeral keys derived via X25519 + HKDF
            </li>
            <li>
              Messages are padded to a uniform 1,024 bytes before encryption to
              prevent length-inference attacks
            </li>
            <li>
              Our indexer API uses Ed25519 signature-based authentication with
              signed time-limited nonces
            </li>
            <li>HTTPS/TLS is enforced for all API communication</li>
            <li>
              Our server uses <code className="text-xs text-sealed-teal/80">helmet</code> security
              headers and rate limiting (100 requests/minute per IP)
            </li>
            <li>
              Private keys are stored in platform secure enclaves (iOS Keychain,
              Android Keystore)
            </li>
            <li>Keys are zeroed in memory after use</li>
          </ul>
          <div className="mt-4 rounded-xl border border-sealed-teal/10 bg-sealed-teal/3 px-5 py-4 text-sm text-[#b3b3b3]">
            <strong className="text-white">
              Post-quantum encryption (upcoming):
            </strong>{' '}
            A planned upgrade will add ML-KEM-512 (Kyber-512) as a hybrid layer
            on top of X25519 for forward-looking quantum resistance.
          </div>

          {/* ── 10 ── */}
          <SectionHeading id="children" number="10">
            Children&apos;s Privacy
          </SectionHeading>
          <p>
            Sealed is not directed at children under the age of 13 (or 16 where
            applicable under local law). We do not knowingly collect data from
            children. If you believe a child has used the service, please contact
            us and we will delete indexer-side data promptly.
          </p>

          {/* ── 11 ── */}
          <SectionHeading id="your-rights" number="11">
            Your Rights
          </SectionHeading>
          <p>
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong className="text-white">Access</strong> the personal data
              we hold about you
            </li>
            <li>
              <strong className="text-white">Rectification</strong> of
              inaccurate data (where technically possible)
            </li>
            <li>
              <strong className="text-white">Erasure</strong>{' '}
              (&ldquo;right to be forgotten&rdquo;) of data held on our servers
              — note this cannot extend to blockchain data
            </li>
            <li>
              <strong className="text-white">Portability</strong> of your
              indexer-held data
            </li>
            <li>
              <strong className="text-white">Object</strong> to processing
            </li>
            <li>
              <strong className="text-white">Withdraw consent</strong> at any
              time (e.g., disabling push notifications revokes FCM token
              registration)
            </li>
          </ul>
          <p>We will respond within 30 days.</p>
          <div className="rounded-xl border border-amber-500/10 bg-amber-500/3 px-5 py-4 text-sm text-[#b3b3b3]">
            <strong className="text-white">Important limitation:</strong> Rights
            of deletion, rectification, and erasure{' '}
            <strong className="text-white">
              do not apply to data written to the public blockchain
            </strong>{' '}
            (Algorand or Solana). That data is outside our technical control by
            design.
          </div>

          {/* ── 12 ── */}
          <SectionHeading id="international" number="12">
            International Data Transfers
          </SectionHeading>
          <p>
            If you access Sealed from outside the region where our indexer server
            is hosted, your indexer-held data may be transferred internationally.
            We implement appropriate safeguards in accordance with applicable
            law.
          </p>
          <p>
            Public blockchain data (Realm B) is replicated globally across all
            blockchain nodes and is not subject to geographic data transfer
            restrictions.
          </p>

          {/* ── 13 ── */}
          <SectionHeading id="changes" number="13">
            Changes to This Policy
          </SectionHeading>
          <p>
            We may update this policy as the app evolves. Material changes will
            be communicated via an in-app notice. Continued use of Sealed after
            such notice constitutes acceptance.
          </p>

          {/* ── 14 ── */}
          <SectionHeading id="contact" number="14">
            Contact
          </SectionHeading>
          <p>
            For privacy-related questions, data requests, or complaints, please
            reach out to us. We will respond within 30 days.
          </p>
          <p>
            If you are in the EU/EEA and believe we have violated your rights
            under the GDPR, you have the right to lodge a complaint with your
            local supervisory authority.
          </p>
        </div>

        {/* closing statement */}
        <div className="mt-20 border-t border-white/6 pt-8 text-center text-sm italic text-[#666]">
          Sealed is designed on the principle that private communication should
          be verifiably private — not just by policy, but by cryptographic
          architecture. This privacy policy reflects that design honestly,
          including the trade-offs involved.
        </div>

        {/* back link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-sealed-teal/20 bg-sealed-teal/5 px-6 py-2.5 text-sm font-medium text-sealed-teal transition-colors hover:bg-sealed-teal/10"
          >
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
