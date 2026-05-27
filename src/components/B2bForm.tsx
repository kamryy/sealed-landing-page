"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import GradientBadge from "@/components/ui/GradientBadge";
import SelectField from "@/components/ui/SelectField";

export default function B2bForm() {
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [organizationRole, setOrganizationRole] = useState("");
  const [workflow, setWorkflow] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!email || !email.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/b2b-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          wallet,
          fullName,
          organization,
          role: organizationRole,
          workflow,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setErrorMessage(
          data.error || "Failed to join waitlist. Please try again.",
        );
        return;
      }

      setSuccessMessage(data.message || "You have been subscribed!");
      setEmail("");
      setWallet("");
      setFullName("");
      setOrganization("");
      setOrganizationRole("");
      setWorkflow("");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative mx-auto   w-[92%] sm:w-[87%] lg:w-[82%]">
        <form
          onSubmit={handleSubmit}
          className="relative z-10 gap-10 lg:gap-16 bg-[#1c1c1c] rounded-[22px]"
        >
          {/* Right: form panel */}
          <div className="relative">
            {/* Teal accent glow behind the panel */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-2 -z-10 rounded-[26px] blur-2xl"
            />

            <div className="rounded-[22px] border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-7">
              <div className="flex flex-col gap-5">
                {/* Floating-label email field */}
                <div className="group relative">
                  <input
                    id="b2b-email"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder=" "
                    className="peer h-14 w-full rounded-xl border border-white/15 bg-black/40 px-4 pt-5 pb-1.5 font-dm-sans text-[15px] leading-5 text-white outline-none transition-all placeholder:text-transparent focus:border-sealed-teal focus:shadow-[0_0_0_4px_rgba(107,250,214,0.12)]"
                    disabled={isSubmitting}
                    required
                  />
                  <label
                    htmlFor="b2b-email"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-dm-sans text-sm text-white/45 transition-all duration-150 peer-focus:top-3 peer-focus:text-[11px] peer-focus:text-sealed-teal peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-white/70"
                  >
                    Full Name
                  </label>
                </div>
                <div className="group relative">
                  <input
                    id="b2b-full-name"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder=" "
                    className="peer h-14 w-full rounded-xl border border-white/15 bg-black/40 px-4 pt-5 pb-1.5 font-dm-sans text-[15px] leading-5 text-white outline-none transition-all placeholder:text-transparent focus:border-sealed-teal focus:shadow-[0_0_0_4px_rgba(107,250,214,0.12)]"
                    disabled={isSubmitting}
                    required
                  />
                  <label
                    htmlFor="b2b-email"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-dm-sans text-sm text-white/45 transition-all duration-150 peer-focus:top-3 peer-focus:text-[11px] peer-focus:text-sealed-teal peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-white/70"
                  >
                    Work email
                  </label>
                </div>

                <div className="group relative">
                  <input
                    id="b2b-organization"
                    type="text"
                    value={organization}
                    onChange={(event) => setOrganization(event.target.value)}
                    placeholder=" "
                    className="peer h-14 w-full rounded-xl border border-white/15 bg-black/40 px-4 pt-5 pb-1.5 font-dm-sans text-[15px] leading-5 text-white outline-none transition-all placeholder:text-transparent focus:border-sealed-teal focus:shadow-[0_0_0_4px_rgba(107,250,214,0.12)]"
                    disabled={isSubmitting}
                    required
                  />
                  <label
                    htmlFor="b2b-organization"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-dm-sans text-sm text-white/45 transition-all duration-150 peer-focus:top-3 peer-focus:text-[11px] peer-focus:text-sealed-teal peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-white/70"
                  >
                    Organization / Protocol Name
                  </label>
                </div>

                <div className="group relative">
                  <input
                    id="b2b-organization-role"
                    type="text"
                    value={organizationRole}
                    onChange={(event) =>
                      setOrganizationRole(event.target.value)
                    }
                    placeholder=" "
                    className="peer h-14 w-full rounded-xl border border-white/15 bg-black/40 px-4 pt-5 pb-1.5 font-dm-sans text-[15px] leading-5 text-white outline-none transition-all placeholder:text-transparent focus:border-sealed-teal focus:shadow-[0_0_0_4px_rgba(107,250,214,0.12)]"
                    disabled={isSubmitting}
                    required
                  />
                  <label
                    htmlFor="b2b-organization-role"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-dm-sans text-sm text-white/45 transition-all duration-150 peer-focus:top-3 peer-focus:text-[11px] peer-focus:text-sealed-teal peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-white/70"
                  >
                    Role / Title
                  </label>
                </div>

                <SelectField
                  id="primary-workflow-select"
                  label="Primary workflow"
                  value={workflow}
                  onChange={(event: string) => setWorkflow(event)}
                  disabled={isSubmitting}
                  options={[
                    {
                      value: "vulnerabilityDisclosure",
                      label: "Vulnerability Disclosure & Audits",
                    },
                    {
                      value: "warRoom",
                      label: "Incident Response / War Room",
                    },
                    {
                      value: "treasuryOTC",
                      label: "Treasury & OTC Operations",
                    },
                    {
                      value: "BoardLegaCoordination",
                      label: "Board & Legal (M&A) Coordination",
                    },
                    { value: "other", label: "Other" },
                  ]}
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative mt-1 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-sealed-teal px-6 py-3.5 font-lexend text-base font-semibold text-black shadow-[0_10px_30px_rgba(107,250,214,0.25)] transition-all hover:shadow-[0_14px_40px_rgba(107,250,214,0.45)] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="relative z-10">
                    {isSubmitting
                      ? "Reserving your spot…"
                      : "Apply for the Program"}
                  </span>
                  {!isSubmitting && (
                    <svg
                      aria-hidden
                      viewBox="0 0 20 20"
                      className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                    >
                      <path
                        d="M4 10h12m0 0l-4-4m4 4l-4 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {/* Shimmer sweep on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                </button>

                {successMessage ? (
                  <div className="flex items-center gap-2 rounded-lg border border-sealed-teal/30 bg-sealed-teal/10 px-3 py-2.5">
                    <svg
                      viewBox="0 0 16 16"
                      className="h-4 w-4 shrink-0 text-sealed-teal"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="font-dm-sans text-sm text-sealed-teal">
                      {successMessage}
                    </p>
                  </div>
                ) : null}

                {errorMessage ? (
                  <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2.5">
                    <p className="font-dm-sans text-sm text-red-300">
                      {errorMessage}
                    </p>
                  </div>
                ) : null}

                {/* <p className="mt-1 font-dm-sans text-xs text-white/35">
                    We'll only email you about the launch. No spam, ever.
                  </p> */}
              </div>
            </div>
          </div>
        </form>
        {/* </section> */}
      </div>
    </div>
  );
}
