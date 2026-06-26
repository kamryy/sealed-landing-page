import Image from "next/image";

import BackgroundEffects from "@/components/layout/BackgroundEffects";
import Footer from "@/components/layout/Footer";
import GradientBadge from "@/components/ui/GradientBadge";
import Navbar from "@/components/layout/Navbar";
import WaitlistSection from "@/components/sections/WaitlistSection";

const faqItems = [
  {
    question: "What is Sealed?",
    answer:
      "Sealed is a privacy-first messenger where message content is end-to-end encrypted, while fees and source code are publicly verifiable on blockchain.",
  },
  {
    question: "Can anyone read my messages?",
    answer:
      "No. Messages are encrypted on your device and can only be decrypted by the intended recipients. Not even Sealed can read them.",
  },
  {
    question: "What data is stored on the blockchain?",
    answer:
      "Only encrypted message envelopes, payment records, and protocol parameters. Message content and user identities are never public.",
  },
  {
    question: "Does Sealed know who am I talking to and what about?",
    answer:
      "No. Sealed does not have access to your contact graph. Each message is delivered to a unique, non-linkable destination.",
  },
  {
    question: "Why does sending a message cost money?",
    answer:
      "Messaging on Sealed is paid because each message is a real transaction on the blockchain, so it comes with a gas fee. A transparent application fee also prevents spam, removes ads and data monetization. The cost depends on your selected tariff or subscription and is calculated per 2 KB of encrypted data.",
  },
  {
    question: "Are message sizes or metadata exposed?",
    answer:
      "No. Messages are padded to fixed-size blocks, making it difficult to infer content or intent from message length.",
  },
  {
    question: "What happens if I lose my phone?",
    answer:
      "You can instantly revoke the lost device. It will no longer be able to decrypt any new messages and your seed phrase wallet works like a backup.",
  },
  {
    question: "Can I use Sealed on multiple devices?",
    answer:
      "Yes. Each device has its own cryptographic keys and can be independently added or removed from your account.",
  },
  {
    question: "Are my messages stored on any servers?",
    answer:
      "No. Sealed does not operate a central message database, instead we use a public blockchain chosen by the user. Messages exist only in encrypted form and are readable exclusively by participants.",
  },
  {
    question: "Does Sealed rely on trust in a central operator?",
    answer:
      "No. Security is enforced cryptographically, and protocol rules are verifiable on-chain rather than enforced by policy.",
  },
  {
    question: "Do I need technical or crypto knowledge to use Sealed?",
    answer:
      "No. All cryptography and blockchain interactions are handled automatically in the background.",
  },
  {
    question: "Can Sealed share my conversations with anyone?",
    answer:
      "No. Sealed cannot share message content with anyone because it does not have access to it. Messages are end-to-end encrypted and only participants hold the decryption keys.",
  },
  {
    question: "Why is Sealed launching on Algorand?",
    answer:
      "Sealed is launching on Algorand as it provides a fast, efficient and one of the safest and most scalable blockchain environment. Sealed brings a privacy-first communication layer to Algorand users, builders and ecosystem participants.",
  },
  {
    question: "Is Sealed just another messenger?",
    answer:
      "No. Sealed App starts with private communication. It is built first for those who care the most about privacy, identity and reduced exposure. The broader Sealed vision goes beyond private messaging and moves toward Sealed Channels - controlled communication environments for high-trust operational processes.",
  },
  {
    question: "What are Sealed Channels?",
    answer:
      "Sealed Channels are the next strategic layer of the Sealed ecosystem. A Sealed Channel is not a normal chat channel like Slack, Discord or Telegram. A Sealed Channel is a controlled communication environment for a specific high-trust operational process.",
  },
];

export default function FAQPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip overflow-y-visible bg-[#0f0f0f] pb-12 pt-0 lg:px-12 lg:pt-6">
      <div className="relative z-10 mx-auto w-full max-w-7xl overflow-visible">
        <Navbar />

        {/* FAQ Hero */}
        <section className="flex flex-col items-center px-8 py-20 lg:py-28">
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
