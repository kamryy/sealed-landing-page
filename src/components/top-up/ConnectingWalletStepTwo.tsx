"use client";

import Image from "next/image";
import ConnectingWalletHeader from "./ConnectingWalletHeader";
import Link from "next/link";

interface CollectingWalletStepTwoProps {
  onStatusChange?: (step: number) => void;
}

export default function CollectingWalletStepTwo({
  onStatusChange,
}: CollectingWalletStepTwoProps) {
  const openModal = () => {
    onStatusChange?.(3);
  };

  return (
    <div className="flex flex-1 flex-col gap-10 w-full items-center justify-between">
      <div className="flex flex-col gap-2 mr-auto">
        <ConnectingWalletHeader
          title="Top up instructions"
          subTitle="To add funds, choose the desired package and confirm your selection
          carefully before proceeding. Each transaction is processed immediately
          and cannot be reversed once completed. Make sure you review your
          balance after the top-up is finished."
        />

        <ol className="flex gap-4 flex-col mt-5 text-[#b3b3b3]">
          <li className="flex items-center gap-2">
            <Image
              src="/assets/icons/checkmark.svg"
              alt="Select packages"
              width={24}
              height={24}
            />
            Select the number of packages you want to purchase
          </li>
          <li className="flex items-center gap-2">
            <Image
              src="/assets/icons/checkmark.svg"
              alt="Confirm payment"
              width={24}
              height={24}
            />
            Confirm the payment using ALGO
          </li>
          <li className="flex items-center gap-2">
            <Image
              src="/assets/icons/checkmark.svg"
              alt="Check balance"
              width={24}
              height={24}
            />
            Check your updated message balance after completion
          </li>
        </ol>

        <Link
          className="w-fit mt-6 text-left text-sealed-teal hover:underline transition-transform duration-200 hover:scale-[1.02]"
          href="https://docs.sealed.channel/introduction/step-by-step"
          target="_blank"
        >
          Step-by-step guide
        </Link>
      </div>

      <div className="flex items-center gap-4 w-full justify-end">
        <button
          className="px-4 py-2 rounded-xl cursor-pointer bg-sealed-teal text-black"
          onClick={openModal}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
