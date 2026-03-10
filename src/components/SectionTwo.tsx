import Image from 'next/image';

import SectionHeader from '@/components/SectionHeader';

/* ──────────────────────────────────────────────────────────────────── *
 *  Feature card data
 * ──────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: '/assets/section_two/no_meta.svg',
    title: 'No metadata collected',
    description:
      'Sealed does not collect or store any metadata that could be used to analyze or track user behavior',
  },
  {
    icon: '/assets/section_two/relationship_anonymity.svg',
    title: 'Relationship anonymity',
    description:
      'The system prevents anyone from determining who is communicating with whom',
  },
  {
    icon: '/assets/section_two/no_censorship.svg',
    title: 'No censorship',
    description:
      'All messages are transmitted freely without filtering, blocking, or content control',
  },
  {
    icon: '/assets/section_two/full_privacy.svg',
    title: 'Full privacy and security',
    description:
      'Only the intended recipients can access messages, with no possibility of third-party access',
  },
  {
    icon: '/assets/section_two/cryptography.svg',
    title: 'Based on cryptography',
    description:
      'All communication is secured using modern, proven cryptographic technologies',
  },
  {
    icon: '/assets/section_two/no_phone.svg',
    title: 'No phone number required',
    description:
      'Users can communicate without providing a phone number or personal identifying information',
  },
] as const;

/* ──────────────────────────────────────────────────────────────────── *
 *  Feature card
 * ──────────────────────────────────────────────────────────────────── */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2.5 rounded-[15px] p-5 text-center shadow-[0_1.25px_2.5px_rgba(0,0,0,0.05)]"
      style={{
        backgroundImage:
          'linear-gradient(203deg, rgba(26,26,26,0) 0%, rgba(26,26,26,0.2) 40%), linear-gradient(90deg, rgba(28,28,28,0.2) 0%, rgba(28,28,28,0.2) 100%)',
      }}
    >
      <Image src={icon} alt="" width={40} height={40} />

      <h3 className="font-lexend text-2xl font-bold leading-10 text-white">
        {title}
      </h3>

      <p className="text-base leading-6.25 text-[#b3b3b3]">{description}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── *
 *  Section Two — "A New Era of Secure Communication"
 * ──────────────────────────────────────────────────────────────────── */

export default function SectionTwo() {
  return (
    <section
      id="benefits"
      className="flex flex-col items-center pt-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(3.5rem,10vw,7.5rem)]"
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <SectionHeader
        badgeIcon="/assets/icons/confirmation.svg"
        badgeText="Next-Gen Privacy"
        title="A New Era of Secure Communication"
        subtitle="Sealed delivers a modern approach to messaging built on advanced cryptography, ensuring complete privacy without servers or third-party access"
      />

      {/* ── Content: photo + feature cards ─────────────────────── */}
      <div className="mt-[clamp(2rem,5vw,3.75rem)] flex w-full max-w-400 flex-col items-center gap-10 xl:flex-row xl:items-stretch xl:justify-center">
        {/* Photo panel */}
        <div className="relative w-full max-w-125 shrink-0 overflow-hidden rounded-[15px] shadow-[0_1.25px_2.5px_rgba(0,0,0,0.05)] xl:w-auto xl:flex-1">
          {/* Gradient overlay layers */}
          <div className="absolute inset-0 z-1 rounded-[15px] bg-[#1a1a1a]" />
          <div
            className="absolute inset-0 z-2 rounded-[15px] opacity-50 mix-blend-screen"
            style={{
              backgroundImage: `url('/assets/section_two/photo.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'top left',
            }}
          />
          <div className="relative z-4 p-5 h-full">
            <div className="relative aspect-3/4 w-full h-full overflow-hidden rounded-[5px] ">
              <Image
                src="/assets/section_two/photo.png"
                alt="Person using Sealed messenger"
                fill
                className="object-cover   "
              />
            </div>
          </div>
          <div
            className="absolute inset-0 z-3 rounded-[15px]"
            style={{
              backgroundImage:
                'linear-gradient(212deg, rgba(26,26,26,0) 0%, rgb(26,26,26) 40%)',
            }}
          />

          {/* Actual image */}
        </div>

        {/* Feature cards grid */}
        <div className="grid w-full max-w-190 grid-cols-1 gap-7.5 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
