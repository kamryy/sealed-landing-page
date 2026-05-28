"use client";

import B2bForm from "@/components/B2bForm";
import Navbar from "@/components/layout/Navbar";
import SwitchButton from "@/components/ui/SwitchButton";
import B2cForm from "@/components/B2cForm";
import Image from "next/image";

import { useState, useRef } from "react";
import PartnersUseCases from "@/components/PartnersUseCases";
import GradientBadge from "@/components/ui/GradientBadge";

export default function PartnersPage() {
  const [showB2bForm, setShowB2bForm] = useState(false);
  const [animState, setAnimState] = useState<"idle" | "out" | "in">("idle");
  const animating = useRef(false);

  const partnersUseCases = [
    {
      title: "Financial & Treasury",
      subTitle: "SEC Penalties for WhatsApp Use ($2.5B)",
      description: `Centralized consumer messaging apps used for business purposes
              outside of IT oversight violate compliance procedures and pose
              enormous legal risks. Between 2022 and 2024, the US Securities and
              Exchange Commission (SEC) imposed over $2.5 billion in fines on
              major Wall Street institutions (including Goldman Sachs and Morgan
              Stanley) for conducting business on WhatsApp and Signal.`,
      sealedDesc: `We provide a serverless architecture for OTC
                and fund offices, eliminating the risk of creating a central
                footprint and logs on external corporate servers.`,
      resources: [
        {
          link: "https://www.investmentnews.com/ria-news/fines-for-wall-street-communications-violations-reach-25b/240865",
          label: "Investment News",
        },
        {
          link: "https://www.collaboris.com/wall-street-whatsapp-compliance-failure/",
          label: "Collaboris",
        },
        {
          link: "https://www.leapxpert.com/electronic-messaging-compliance-investigation-and-regulatory-fines-summary/",
          label: "LeapXpert",
        },
      ],
    },
    {
      title: "Corporate/Legal",
      subTitle: "Slack steals 1.2 TB of Disney data",
      description: `Slack and MS Teams store message histories on central servers. Compromising the account of just one employee gives hackers access to the entire company archive.


In July 2024, the NullBulge group stole as much as 1.2 terabytes of data from Disney's corporate Slack – including internal code, unpublished projects, and financial documents.`,
      sealedDesc: `Complete lack of central data retention. Our rooms are ephemeral. Even if a user's device is compromised, a hacker won't find the company's central archive because it doesn't physically exist.`,
      resources: [
        {
          link: "https://www.paubox.com/blog/hacker-pleads-guilty-after-leaking-1.1tb-of-disneys-data",
          label: "Paubox",
        },
        {
          link: "https://www.sentinelone.com/labs/nullbulge-threat-actor-masquerades-as-hacktivist-group-rebelling-against-ai/",
          label: "SentinelOne",
        },
        {
          link: "https://incidentdatabase.ai/cite/950/",
          label: "AI Incident Database",
        },
      ],
    },
    {
      title: "Web3 Security",
      subTitle: "Telegram API Scrapping and Metadata Leak",
      description: `Encrypting message content does not protect against traffic analysis. Leaking metadata (who is talking to whom, and when) exposes audit processes and creates the risk of front-running a vulnerability before a patch is deployed.


Telegram regularly encounters leaks of databases linking user IDs to phone numbers (recent mass incidents leaked over 200 million records, and earlier databases leaked 900 MB). This is used by hackers to map developer relationships and spear-phish.`,
      sealedDesc: `Our protocol in a dedicated Sealed Disclosure Room masks metadata. Data Padding technology makes network traffic appear as random noise during a crisis, cutting off spy bots from the relationship graph.`,
      resources: [
        {
          link: "https://cybernews.com/security/200m-telegram-user-records-shared-on-a-data-leak-forum/",
          label: "Cybernews",
        },
        {
          link: "https://cisomag.com/telegram-data-breach/",
          label: "CISO Mag",
        },
        {
          link: "https://www.cybersecurity-insiders.com/telegram-data-breach-allegedly-exposes-details-of-200-million-users/",
          label: "Cybersecurity Insiders",
        },
      ],
    },
  ];

  const handleSwitch = (next: boolean) => {
    if (animating.current || next === showB2bForm) return;
    animating.current = true;

    setAnimState("out");

    setTimeout(() => {
      setShowB2bForm(next);
      setAnimState("in");

      setTimeout(() => {
        setAnimState("idle");
        animating.current = false;
      }, 200);
    }, 200);
  };

  return (
    <main className="relative max-h-screen overflow-x-clip pb-12 pt-0 lg:px-12 lg:pt-6 min-h-screen">
      <div className="relative z-10 mx-auto w-full max-w-7xl overflow-visible">
        <Navbar />

        <div className="rounded-2xl p-5 relative z-10 mt-4 flex gap-6 flex-col align-items-center text-center">
          <div>
            <GradientBadge>
              <Image
                src="/assets/icons/confirmation.svg"
                alt=""
                width={24}
                height={24}
              />
              <p className="font-lexend text-[clamp(0.95rem,1.4vw,1.125rem)] font-light leading-[1.35] text-white">
                Support & Setup
              </p>
            </GradientBadge>
          </div>

          <div className="flex items-center gap-5 flex-col">
            <h3 className="max-w-260 text-balance font-lexend text-[clamp(2rem,5.4vw,3rem)] font-bold leading-[1.06] text-white lg:max-w-none lg:text-[clamp(2.25rem,3vw,2.9rem)] mt-4">
              <span className="">Sealed Disclosure Room</span>{" "}
            </h3>
            <span className="max-w-312.5 text-balance leading-[clamp(1.5rem,3vw,1.875rem)] text-[#E4E4E7]">
              Because zero-day vulnerability coordination does not belong on
              Telegram
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch [&>*]:h-full">
            {partnersUseCases.map((useCase, index) => (
              <PartnersUseCases
                title={useCase.title}
                subTitle={useCase.subTitle}
                description={useCase.description}
                sealedDesc={useCase.sealedDesc}
                resources={useCase.resources}
                key={index}
              />
            ))}
            <div
              className="min-h-[447px] lg:min-h-0 relative group flex flex-col items-center justify-center rounded-[15px] text-center shadow-[0_1.25px_2.5px_rgba(0,0,0,0.05)] ring-1 ring-transparent transition-all duration-300 ease-out "
              style={{
                backgroundImage:
                  "linear-gradient(203deg, rgba(26,26,26,0) 0%, rgba(26,26,26,0.2) 40%), linear-gradient(90deg, rgba(28,28,28,0.2) 0%, rgba(28,28,28,0.2) 100%)",
              }}
            >
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
               bg-[linear-gradient(93.59deg,#6BFAD6_18.6%,#CA7344_96.15%)]"
                style={{
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "1px",
                }}
              />
              <p className="text-md font-bold text-white/80 px-10 w-full ">
                Sealed builds isolated, serverless coordination environments
                engineered to eliminate operational visibility, metadata
                exposure and centralized retention.
              </p>
            </div>
          </div>

          <div className="flex justify-center background-image: linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px); background-size: 32px 32px; mask-image: radial-gradient(circle, black 0%, transparent 80%); relative mt-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-y-14 left-1/2 -z-10 w-screen -translate-x-1/2 bg-no-repeat opacity-35"
              style={{
                backgroundImage: "url('/assets/whitelist/bg.png')",
                backgroundSize: "auto 120%",
                backgroundPosition: "center top",
              }}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10 z-0 rounded-[3rem] bg-[radial-gradient(circle_at_50%_55%,rgba(107,250,214,0.34)_0%,rgba(107,250,214,0.18)_35%,rgba(107,250,214,0.04)_60%,rgba(107,250,214,0)_78%)] blur-2xl animate-[sealedHaloPulse_4.2s_ease-in-out_infinite]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 z-1 rounded-4xl bg-[radial-gradient(circle_at_50%_50%,rgba(107,250,214,0.42)_0%,rgba(107,250,214,0.24)_34%,rgba(107,250,214,0.08)_62%,rgba(107,250,214,0)_82%)] blur-3xl animate-[sealedHaloPulse_3.8s_ease-in-out_infinite]"
            />

            <section className="relative z-10 rounded-[28px] border border-white/10 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:pt-5 lg:pb-2 w-[100%] sm:w-[80%]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <div
                  className="absolute inset-0 rounded-[28px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(266deg, #0d0d0d 40.67%, rgba(16, 16, 16, 0) 99.81%), linear-gradient(90deg, #0d0d0d 0%, #0f0f0f 100%)",
                  }}
                />
                {/* Subtle corner highlight */}
                <div
                  className="absolute inset-0 opacity-60 rounded-[28px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 15% 0%, rgba(107,250,214,0.12) 0%, transparent 45%), radial-gradient(circle at 100% 100%, rgba(107,250,214,0.08) 0%, transparent 55%)",
                  }}
                />
                {/* Fine grid texture */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                    maskImage:
                      "radial-gradient(circle at center, black 0%, transparent 80%)",
                    WebkitMaskImage:
                      "radial-gradient(circle at center, black 0%, transparent 80%)",
                  }}
                />
              </div>

              <div className="relative z-10 grid grid-cols-1 gap-10 lg:gap-5">
                {/* Left: copy */}
                <div className="flex flex-col items-center gap-6 lg:gap-7">
                  <GradientBadge>
                    <Image
                      src="/assets/icons/check-circle.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <p className="font-lexend text-[clamp(0.95rem,1.4vw,1.125rem)] font-light leading-[1.35] text-white">
                      Join Sealed
                    </p>
                  </GradientBadge>

                  <div className="w-[100%] sm:w-[85%]">
                    <h2 className="font-lexend flex flex-col text-[clamp(1.8rem,4vw,2.1rem)] text-left font-bold leading-[1.2] text-white">
                      Restore privacy in both your private communication and
                      business infrastructure.
                    </h2>
                  </div>
                </div>

                {/* Right: form panel */}
                <div className="relative">
                  {/* Teal accent glow behind the panel */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-2 -z-10 rounded-[26px] bg-[radial-gradient(circle_at_50%_50%,rgba(107,250,214,0.1),transparent_70%)] blur-2xl"
                  />

                  <div className="rounded-[22px] p-2 sm:p-7">
                    <SwitchButton
                      defaultValue={false}
                      onChange={handleSwitch}
                    />
                    <section className="relative z-20 rounded-[22px] px-1 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-">
                      {!showB2bForm ? <B2cForm /> : <B2bForm />}
                    </section>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          height: 36px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 0 10px;
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input:focus {
          border-color: #6bfad6;
          box-shadow: 0 0 0 3px #6bfad640;
        }
        .submit-btn {
          width: 100%;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: #6bfad6;
          color: #04342c;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
 
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-24px); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(24px); }
        }
 
        .animate-slide-in-right  { animation: slideInRight  .2s ease forwards; }
        .animate-slide-in-left   { animation: slideInLeft   .2s ease forwards; }
        .animate-slide-out-left  { animation: slideOutLeft  .15s ease forwards; }
        .animate-slide-out-right { animation: slideOutRight .15s ease forwards; }
      `}</style>
    </main>
  );
}
