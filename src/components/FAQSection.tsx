import Image from 'next/image';

import GradientBadge from '@/components/GradientBadge';

const faqItems = [
  {
    question: 'What is Sealed?',
    answer:
      'Sealed is a privacy-first messenger where message content is end-to-end encrypted, while fees and source code are publicly verifiable on blockchain.',
  },
  {
    question: 'Can anyone read my messages?',
    answer:
      'No. Messages are encrypted on your device and can only be decrypted by the intended recipients. Not even Sealed can read them.',
  },
  {
    question: 'What data is stored on the blockchain?',
    answer:
      'Only encrypted message envelopes, payment records, and protocol parameters. Message content and user identities are never public.',
  },
  {
    question: 'Does Sealed know who I am talking to?',
    answer:
      'No. Sealed does not have access to your contact graph. Each message is delivered to a unique, non-linkable destination.',
  },
  {
    question: 'Why does sending a message cost money?',
    answer:
      'Messaging on Sealed is paid because each message is a real transaction on the blockchain, so it comes with a gas fee. A transparent application fee also prevents spam, removes ads and data monetization, and allows Sealed to operate without central servers.',
  },
  {
    question: 'How much does a message cost?',
    answer:
      'The cost depends on your selected tariff or subscription and is calculated per 2 KB of encrypted data. The exact price is always shown before sending.',
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="relative mt-66 flex flex-col items-center py-10 lg:mt-46 lg:py-20"
    >
      <div className="w-full max-w-[1600px]">
        <div className="flex max-w-[900px] flex-col items-start gap-6">
          <GradientBadge>
            <Image
              src="/assets/icons/check-circle.svg"
              alt=""
              width={24}
              height={24}
            />
            <p className="font-lexend text-[clamp(0.95rem,1.4vw,1.125rem)] font-light leading-[1.35] text-white">
              Support &amp; Setup
            </p>
          </GradientBadge>

          <div className="space-y-3">
            <h2 className="font-lexend text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.05] text-white">
              Managing Your Account &amp; FAQs
            </h2>
            <p className="max-w-[900px] font-dm-sans text-[clamp(0.95rem,2vw,1.125rem)] leading-[1.5] text-[#b3b3b3]">
              All your questions about subscriptions, payments, and billing
              cycles answered here.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 lg:mt-16 lg:grid-cols-2 lg:gap-y-12">
          {faqItems.map((item) => (
            <article key={item.question} className="space-y-2.5">
              <h3 className="font-lexend text-[clamp(1.2rem,1.8vw,1.45rem)] font-medium leading-[1.32] text-white">
                {item.question}
              </h3>
              <p className="font-dm-sans text-[clamp(0.95rem,1.55vw,1.2rem)] leading-[1.45] text-[#b3b3b3]">
                {item.answer}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center lg:mt-14">
          <a
            href="/faq"
            className="rounded-xl bg-sealed-teal px-5 py-3 font-lexend text-base font-semibold text-black transition-opacity hover:opacity-90 md:text-lg"
          >
            View all FAQs
          </a>
        </div>
      </div>
    </section>
  );
}
