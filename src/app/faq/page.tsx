import Image from 'next/image';

import BackgroundEffects from '@/components/layout/BackgroundEffects';
import Footer from '@/components/layout/Footer';
import GradientBadge from '@/components/ui/GradientBadge';
import Navbar from '@/components/layout/Navbar';
import WaitlistSection from '@/components/sections/WaitlistSection';

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
  {
    question: 'Are message sizes or metadata exposed?',
    answer:
      'No. Messages are padded to fixed-size blocks, making it difficult to infer content or intent from message length.',
  },
  {
    question: 'What happens if I lose my phone?',
    answer:
      'You can instantly revoke the lost device. It will no longer be able to decrypt any new messages and your seed phrase wallet works like a backup.',
  },
  {
    question: 'Can I use Sealed on multiple devices?',
    answer:
      'Yes. Each device has its own cryptographic keys and can be independently added or removed from your account.',
  },
  {
    question: 'Are my messages stored on Sealed servers?',
    answer:
      'No. Sealed does not operate a central message database, instead we use a public blockchain chosen by the user. Messages exist only in encrypted form and are readable exclusively by participants.',
  },
  {
    question: 'Is Sealed suitable for private or sensitive conversations?',
    answer:
      'Yes. Sealed is designed for situations where confidentiality and minimal metadata exposure are critical.',
  },
  {
    question: 'Does Sealed rely on trust in a central operator?',
    answer:
      'No. Security is enforced cryptographically, and protocol rules are verifiable on-chain rather than enforced by policy.',
  },
  {
    question: 'Do I need technical or crypto knowledge to use Sealed?',
    answer:
      'No. All cryptography and blockchain interactions are handled automatically in the background.',
  },
  {
    question: 'What is the Sealed utility token used for?',
    answer:
      'The token is used for staking, participating in protocol incentives, and sharing in application-level revenue share.',
  },
  {
    question: 'Do I need the token to send or receive messages?',
    answer: 'No. Messaging functionality does not require holding the token.',
  },
  {
    question: 'How does staking the token work?',
    answer:
      'Stakers lock their tokens in a smart contract and receive a proportional share of messaging fees distributed by the protocol.',
  },
  {
    question: 'Where do staking rewards come from?',
    answer:
      "Rewards come directly from real usage fees paid by users, not from inflation or emissions and paid out in blockchain's native currency.",
  },
  {
    question: 'Does the token affect message privacy or encryption?',
    answer:
      'No. Token ownership has no impact on encryption, access to messages, or user privacy.',
  },
  {
    question: 'Can Sealed share my conversations with anyone?',
    answer:
      'No. Sealed cannot share message content with anyone because it does not have access to it. Messages are end-to-end encrypted and only participants hold the decryption keys.',
  },
];

export default function FAQPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip overflow-y-visible bg-[#0f0f0f] pb-12 pt-0 lg:px-12 lg:pt-6">
      <BackgroundEffects />

      <div className="relative z-10 mx-auto w-full max-w-7xl overflow-visible">
        <Navbar />

        {/* FAQ Hero */}
        <section className="mt-24 flex flex-col items-center px-8 py-20 lg:mt-32 lg:py-28">
          <div className="flex max-w-[840px] flex-col items-center gap-4 text-center">
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

            <h1 className="font-lexend text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.15] text-white">
              Frequently Asked Questions
            </h1>
            <p className="max-w-[780px] font-dm-sans text-[clamp(1rem,1.6vw,1.25rem)] font-light leading-[1.5] text-[#e4e4e7]">
              Sealed solution ensures total privacy by enabling communication
              that cannot be monitored, tracked, or accessed by any third party.
            </p>
          </div>
        </section>

        {/* FAQ Grid */}
        <section className="px-8 lg:px-4">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-2 lg:gap-y-16">
            {faqItems.map((item) => (
              <article key={item.question} className="space-y-3">
                <h3 className="font-lexend text-[clamp(1.15rem,1.6vw,1.5625rem)] font-medium leading-[1.5] text-white">
                  {item.question}
                </h3>
                <p className="font-dm-sans text-[clamp(0.95rem,1.4vw,1.375rem)] leading-[1.4] text-[#b3b3b3]">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Whitelist */}
        <div
          id="whitelist"
          className="relative z-30 mt-36 overflow-visible px-8 lg:mt-44 lg:px-4"
        >
          <WaitlistSection />
        </div>

        {/* Footer */}
        <div className="relative z-30 mt-10 overflow-visible px-8 lg:mt-14 lg:px-4">
          <Footer />
        </div>
      </div>
    </main>
  );
}
