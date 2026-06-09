"use client";

import { useState } from "react";

import Stepper from "@/components/top-up/Stepper";
import ConnectingWalletStepOne from "@/components/top-up/ConnectingWalletStepOne";
import ConnectingWalletStepTwo from "./ConnectingWalletStepTwo";
import ConnectingWalletStepThree from "./ConnectingWalletStepThree";
import ConnectingWalletStepFour from "./ConnectingWalletStepFour";
import ConnectingWalletStepFive from "./ConnectingWalletStepFive";

export default function ConnectingWalletContainer() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleStatusChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center gap-4 text-center w-full">
        <Stepper
          currentStep={currentStep}
          sendUnLinkWallet={handleStatusChange}
        />
      </div>

      <div className="rounded-b-lg p-10 w-full h-[500px] bg-[#1c1c1c]">
        {currentStep === 1 && (
          <ConnectingWalletStepOne onStatusChange={handleStatusChange} />
        )}

        {currentStep === 2 && (
          <ConnectingWalletStepTwo onStatusChange={handleStatusChange} />
        )}

        {currentStep === 3 && (
          <ConnectingWalletStepThree onStatusChange={handleStatusChange} />
        )}

        {currentStep === 4 && (
          <ConnectingWalletStepFour onStatusChange={handleStatusChange} />
        )}

        {currentStep === 5 && (
          <ConnectingWalletStepFive onStatusChange={handleStatusChange} />
        )}
      </div>
    </div>
  );
}
