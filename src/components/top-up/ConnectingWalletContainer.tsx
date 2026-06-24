"use client";

import { useState } from "react";

import Stepper from "@/components/top-up/Stepper";
import ConnectingWalletStepOne from "@/components/top-up/ConnectingWalletStepOne";
import ConnectingWalletStepTwo from "./ConnectingWalletStepTwo";
import ConnectingWalletStepThree from "./ConnectingWalletStepThree";
import ConnectingWalletStepFour from "./ConnectingWalletStepFour";
import ConnectingWalletStepFive from "./ConnectingWalletStepFive";

export interface CodeItem {
  id: number;
  code: string;
}

export default function ConnectingWalletContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quantity, setQuantity] = useState<number>(0);

  // MiMC codes are generated client-side during the deposit step (3) and held
  // here, then shown at step 5. No server fetch — the backup note IS the code.
  const [codes, setCodes] = useState<CodeItem[]>([]);

  const handleStatusChange = (step: number) => {
    // Returning to the quantity step starts a fresh top-up — clear prior codes.
    if (step === 3) setCodes([]);
    setCurrentStep(step);
  };

  const handleCodesGenerated = (generated: string[]) => {
    setCodes(generated.map((code, index) => ({ id: index + 1, code })));
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center gap-4 text-center w-full">
        <Stepper
          currentStep={currentStep}
          sendUnLinkWallet={handleStatusChange}
        />
      </div>

      <div className="rounded-b-2xl p-4 sm:p-10 w-full min-h-[500px] flex flex-col bg-[#1c1c1c]">
        {currentStep === 1 && (
          <ConnectingWalletStepOne onStatusChange={handleStatusChange} />
        )}

        {currentStep === 2 && (
          <ConnectingWalletStepTwo onStatusChange={handleStatusChange} />
        )}

        {currentStep === 3 && (
          <ConnectingWalletStepThree
            onStatusChange={handleStatusChange}
            onQuantityChange={setQuantity}
            onCodesGenerated={handleCodesGenerated}
            quantity={quantity}
          />
        )}

        {currentStep === 4 && (
          <ConnectingWalletStepFour onStatusChange={handleStatusChange} />
        )}

        {currentStep === 5 && (
          <ConnectingWalletStepFive
            onStatusChange={handleStatusChange}
            codes={codes}
            loading={false}
            error={null}
          />
        )}
      </div>
    </div>
  );
}
