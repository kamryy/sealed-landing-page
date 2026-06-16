"use client";

import { useEffect, useRef, useState } from "react";

import Stepper from "@/components/top-up/Stepper";
import ConnectingWalletStepOne from "@/components/top-up/ConnectingWalletStepOne";
import ConnectingWalletStepTwo from "./ConnectingWalletStepTwo";
import ConnectingWalletStepThree from "./ConnectingWalletStepThree";
import ConnectingWalletStepFour from "./ConnectingWalletStepFour";
import ConnectingWalletStepFive from "./ConnectingWalletStepFive";
import { fetchCodes } from "@/services/PurchaseService";

export interface CodeItem {
  id: number;
  code: string;
}

function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export default function ConnectingWalletContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quantity, setQuantity] = useState<number>(0);

  const [codes, setCodes] = useState<CodeItem[]>([]);
  const [codesLoading, setCodesLoading] = useState(false);
  const [codesError, setCodesError] = useState<string | null>(null);
  const fetchStarted = useRef(false);

  const handleStatusChange = (step: number) => {
    // Returning to the quantity step starts a fresh purchase — reset delivery state.
    if (step === 3) {
      fetchStarted.current = false;
      setCodes([]);
      setCodesError(null);
      setCodesLoading(false);
    }
    setCurrentStep(step);
  };

  // Delivery codes are fetched as soon as the user reaches the consent step (4),
  // so they're ready by the time the user finishes reading and reaches step 5.
  useEffect(() => {
    if (currentStep !== 4 || fetchStarted.current) return;
    fetchStarted.current = true;

    let cancelled = false;

    const loadCodes = async () => {
      const pubHex = sessionStorage.getItem("deliveryPub") ?? "";
      const privHex = sessionStorage.getItem("deliveryPriv") ?? "";
      if (!pubHex || !privHex) {
        if (!cancelled)
          setCodesError("Missing delivery keys. Please retry the purchase.");
        return;
      }

      if (!cancelled) setCodesLoading(true);
      try {
        const fetched = await fetchCodes(
          hexToUint8Array(pubHex),
          hexToUint8Array(privHex),
        );
        if (!cancelled)
          setCodes(fetched.map((code, index) => ({ id: index + 1, code })));
      } catch (err) {
        if (!cancelled)
          setCodesError(
            err instanceof Error ? err.message : "Failed to fetch codes",
          );
      } finally {
        if (!cancelled) setCodesLoading(false);
      }
    };

    loadCodes();

    return () => {
      cancelled = true;
    };
  }, [currentStep]);

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
            loading={codesLoading}
            error={codesError}
          />
        )}
      </div>
    </div>
  );
}
