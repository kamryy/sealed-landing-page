import Image from 'next/image';

import SectionHeader from '@/components/SectionHeader';

const listItems = [
  '45% of all staking rewards are allocated directly to revenue sharing',
  'Passive income generated without active trading or management',
  'Transparent and long-term incentive model for token holders',
];

const utilityListItems = [
  'Subscription plans allow you to send a significantly higher number of messages at a much lower price',
  'Additional perks and advantages available only to token subscribers',
  'Cost-effective messaging powered by token-based utilities',
];

export default function SectionFour() {
  return (
    <section className="relative mt-16 flex flex-col items-center gap-4 px-4 pt-0.5 lg:mt-0 lg:px-0">
      {/* Header */}
      <SectionHeader
        badgeIcon="/assets/icons/check-circle.svg"
        badgeText="Earn with Every Message"
        title="Token-Powered Earnings & Benefits"
        subtitle="Discover how the token combines passive income opportunities with practical subscription benefits to maximize both earnings and everyday utility"
      />

      {/* Content Section */}
      <div className="mt-8 flex w-full flex-col items-center gap-10 lg:mt-14 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
        {/* Left - Dashboard Image */}
        <div
          className="relative aspect-[4/3] w-full max-w-[520px] shrink-0 overflow-hidden rounded-2xl border border-sealed-teal lg:aspect-[16/11] lg:w-[480px] xl:w-[520px]"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
          }}
        >
          <Image
            src="/assets/section_four/photo_1.png"
            alt="Sealed Dashboard Preview"
            fill
            className="object-cover object-top"
          />
          {/* Bottom gradient overlay */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 lg:h-40"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, black 66.445%)',
              filter: 'blur(40px)',
            }}
          />
          {/* Left gradient overlay */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 top-0 w-16 lg:w-24"
            style={{
              background:
                'linear-gradient(to right, black 33.555%, rgba(0, 0, 0, 0.6) 100%)',
              filter: 'blur(40px)',
            }}
          />
        </div>

        {/* Right - Content */}
        <div className="flex flex-1 flex-col gap-4 md:gap-5 lg:gap-6">
          {/* Title */}
          <h2 className="text-center font-inter text-2xl font-semibold leading-snug text-white md:text-3xl lg:text-left lg:text-[28px] xl:text-[32px]">
            Invest with confidence
          </h2>

          {/* Description */}
          <p className="text-center font-dm-sans text-base leading-7 text-[#b3b3b3] md:text-lg lg:leading-8 xl:text-xl xl:leading-9">
            Earn passive income by investing in our token and benefiting from a
            sustainable revenue-sharing model. A significant portion of platform
            earnings is redistributed to token holders through staking rewards.
          </p>

          {/* List Items */}
          <div className="flex flex-col gap-2.5 md:gap-3 lg:gap-4">
            {listItems.map((item, index) => (
              <div
                key={index}
                className="flex w-full items-start gap-3 md:items-center"
              >
                {/* Checkmark Icon */}
                <div className="relative mt-0.5 h-5 w-5 shrink-0 md:mt-0 md:h-5 md:w-5 lg:h-6 lg:w-6">
                  <Image
                    src="/assets/section_four/checkmark.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Text */}
                <p className="flex-1 font-dm-sans text-sm leading-6 text-[#b3b3b3] md:text-base lg:text-[17px] lg:leading-7 xl:text-lg">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Token Utility & Subscription Benefits Section */}
      <div className="mt-16 flex w-full flex-col-reverse items-center gap-10 lg:mt-24 lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
        {/* Left - Content */}
        <div className="flex flex-1 flex-col gap-5 md:gap-6 lg:gap-8">
          {/* Title */}
          <h2 className="text-center font-inter text-2xl font-semibold leading-snug text-white md:text-3xl lg:text-left lg:text-[28px] xl:text-[36px]">
            Token Utility &amp; Subscription Benefits
          </h2>

          {/* Description */}
          <p className="text-center font-dm-sans text-base leading-7 text-[#b3b3b3] md:text-lg lg:text-left lg:leading-8 xl:text-xl xl:leading-[42px]">
            The token plays a central role in the ecosystem, unlocking added
            value for active users and subscribers. By becoming a subscriber,
            users gain access to exclusive benefits and reduced costs, making
            communication more efficient and affordable
          </p>

          {/* List Items */}
          <div className="flex flex-col gap-3 md:gap-3.5 lg:gap-4">
            {utilityListItems.map((item, index) => (
              <div
                key={index}
                className="flex w-full items-start gap-3 md:items-center lg:gap-4"
              >
                {/* Checkmark Icon */}
                <div className="relative mt-0.5 h-5 w-5 shrink-0 md:mt-0 md:h-6 md:w-6 lg:h-7 lg:w-7">
                  <Image
                    src="/assets/section_four/checkmark_2.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Text */}
                <p className="flex-1 font-dm-sans text-sm leading-6 text-[#b3b3b3] md:text-base lg:text-lg lg:leading-[30px] xl:text-xl">
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* Sign up Button */}
          <button className="mx-auto mt-2 w-fit rounded-xl bg-sealed-teal px-5 py-3 font-lexend text-base font-medium text-black transition-opacity hover:opacity-90 md:px-6 md:py-3.5 md:text-lg lg:mx-0">
            Sign up
          </button>
        </div>

        {/* Right - Token Image */}
        <div
          className="relative aspect-[750/571] w-full max-w-[520px] shrink-0 overflow-hidden rounded-2xl border border-sealed-teal lg:aspect-[750/571] lg:w-[480px] xl:w-[520px]"
          style={{
            background: 'black',
          }}
        >
          <Image
            src="/assets/section_four/photo_2.png"
            alt="Token Coin"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
