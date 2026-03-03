import Image from 'next/image';
import GradientBadge from './GradientBadge';

interface SectionHeaderProps {
  badgeIcon: string;
  badgeText: string;
  title: string;
  subtitle: string;
  centered?: boolean;
}

export default function SectionHeader({
  badgeIcon,
  badgeText,
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex w-full max-w-312.5 flex-col items-center gap-3.75 pt-[2.5px] ${centered ? 'text-center' : ''}`}
    >
      <GradientBadge>
        <Image src={badgeIcon} alt="" width={24} height={24} />
        <p className="font-lexend text-[clamp(0.95rem,1.4vw,1.125rem)] font-light leading-[1.35] text-white">
          {badgeText}
        </p>
      </GradientBadge>

      <h2 className="max-w-260 text-balance font-lexend text-[clamp(2rem,5.4vw,2.5rem)] font-bold leading-[1.06] text-white lg:max-w-none lg:text-[clamp(2.25rem,3vw,2.9rem)] mt-4">
        {title}
      </h2>

      <p className="max-w-312.5 text-balance text-[clamp(1rem,2.2vw,1.25rem)] leading-[clamp(1.5rem,3vw,1.875rem)] text-[#b3b3b3]">
        {subtitle}
      </p>
    </div>
  );
}
