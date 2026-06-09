"use client";

import Image from "next/image";
import { useWallet } from "@txnlab/use-wallet-react";

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  status?: string;
  sendUnLinkWallet?: (step: number) => void;
}

export default function Stepper({
  currentStep,
  totalSteps = 5,
  sendUnLinkWallet,
}: StepperProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const { activeAddress, activeWallet } = useWallet();

  const unlinkWallet = () => {
    activeWallet?.disconnect();
    sendUnLinkWallet?.(1);
  };

  return (
    <div className="flex items-center justify-between bg-[#161616] px-8 py-5 w-full rounded-t-lg border-b border-[rgba(255,255,255,0.1)]">
      <div
        className={`${activeAddress ? "border border-sealed-teal" : "border border-zinc-700"} flex items-center rounded-full px-3 py-1 text-xs text-zinc-300`}
      >
        <div
          className={`${activeAddress ? "bg-sealed-teal" : "border border-zinc-500"} w-2 h-2  rounded-full mr-2`}
        />
        <p className="text-xs text-zinc-300">
          {activeAddress ? "Connected" : "Not Connected"}
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={step} className="flex items-center">
              <div
                className={`
                  relative z-10
                  flex h-6 w-6 items-center justify-center
                  rounded-full border
                  text-[10px] font-medium
                  bg-[#0f0f10]
                  ${
                    isActive
                      ? "border-sealed-teal border text-sealed-teal"
                      : isCompleted
                        ? "border-sealed-teal border bg-sealed-teal text-black"
                        : "border-[#b3b3b3b]"
                  }
                `}
              >
                {isCompleted ? "✓" : step}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    w-7 border-t
                    ${isCompleted ? "border-sealed-teal" : "border-zinc-500"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Help */}
      <button
        type="button"
        onClick={unlinkWallet}
        className={`${activeAddress ? "text-red-500 border border-red-500 rounded-md px-2 py-2" : "text-zinc-500"} transition cursor-pointer flex items-center gap-2`}
      >
        {activeAddress && <p>Un-link wallet</p>}
        <Image
          src="/assets/icons/unlink.svg"
          alt="Help icon"
          width={16}
          height={16}
          style={{
            filter: activeAddress
              ? "none"
              : "invert(80%) sepia(4%) saturate(7%) hue-rotate(10deg) brightness(90%)",
          }}
        />
      </button>
    </div>
  );
}
