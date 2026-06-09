"use client";

import { useState } from "react";
import ConnectingWalletModal from "@/components/top-up/ConnectingWalletModal";
import ConnectingWalletHeader from "./ConnectingWalletHeader";
import Image from "next/image";

interface CollectingWalletStepTwoProps {
  onStatusChange?: (step: number) => void;
}

export default function CollectingWalletStepFour({
  onStatusChange,
}: CollectingWalletStepTwoProps) {
  const [consent, setConsent] = useState(false);
  const [consentTwo, setConsentTwo] = useState(false);

  const goNext = () => {
    onStatusChange?.(5);
  };

  return (
    <div className="flex items-center flex-col gap-6 h-full w-full flex flex-col items-center justify-between">
      <div className="flex flex-col gap-2 mr-auto">
        <ConnectingWalletHeader
          title="Important information"
          subTitle="Read the text below and check the checkboxes to continue."
        />

        <div className="overflow-hidden overflow-y-auto p-4 w-full h-[240px] scroll-y border border-[#262626] text-[#b3b3b3b]">
          <div className="flex flex-col mb-4">
            <p className="text-sm text-zinc-400">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
              est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
              velit, sed quia non numquam eius modi tempora incidunt ut labore
              et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
              veniam, quis nostrum exercitationem ullam corporis suscipit
              laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem
              vel eum iure reprehenderit q
            </p>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="understand-checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="w-4 h-4 cursor-pointer appearance-none bg-transparent border border-gray-500 rounded checked:bg-sealed-teal checked:border-sealed-teal accent-white"
              />
              <label
                htmlFor="understand-checkbox"
                className="text-gray-400 cursor-pointer text-sm"
              >
                I understand
              </label>
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <p className="text-sm text-zinc-400">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
              est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
              velit, sed quia non numquam eius modi tempora incidunt ut labore
              et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
              veniam, quis nostrum exercitationem ullam corporis suscipit
              laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem
              vel eum iure reprehenderit
            </p>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="understand-checkbox2"
                checked={consentTwo}
                onChange={(event) => setConsentTwo(event.target.checked)}
                className="w-4 h-4 cursor-pointer appearance-none bg-transparent border border-gray-500 rounded checked:bg-sealed-teal checked:border-sealed-teal accent-white"
              />
              <label
                htmlFor="understand-checkbox2"
                className="text-gray-400 cursor-pointer text-sm"
              >
                I understand
              </label>
            </div>
          </div>
        </div>

        {!(consent && consentTwo) ? (
          <div className="flex items-center gap-2 mt-3">
            <Image
              src="/assets/icons/red-triangle.svg"
              alt="red-triangle"
              width="16"
              height="16"
            />
            <p className="text-md text-red-500">
              Confirm all checkbox to continue
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-4 w-full justify-between">
        <button
          className="px-6 py-3 rounded-xl cursor-pointer border border-[rgba(255,255,255,0.2)] "
          onClick={() => onStatusChange?.(3)}
        >
          Back
        </button>

        <button
          className="px-4 py-2 rounded-xl cursor-pointer bg-sealed-teal text-black disabled:bg-[#1f1f1f] disabled:border disabled:border-[rgba(255,255,255,0.2)] disabled:text-[rgba(255,255,255,0.2)]"
          onClick={goNext}
          disabled={!(consent && consentTwo)}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
