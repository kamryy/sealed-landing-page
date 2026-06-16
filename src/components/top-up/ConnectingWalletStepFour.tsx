"use client";

import { useState } from "react";
import ConnectingWalletHeader from "./ConnectingWalletHeader";
import Image from "next/image";

interface CollectingWalletStepFourProps {
  onStatusChange?: (step: number) => void;
}

const CONSENT_NOTES: { title: string; body: string }[] = [
  {
    title:
      "The transaction has already been made — do not refresh or leave the page",
    body: "I understand that the ALGO payment has already been approved in the smart contract, and from this moment I must not refresh the page, close it, navigate back in the browser, or leave it, as this may cause the loss of access to the generated codes. Proceeding starts the code delivery process, so interrupting it may make Sealed unable to display the codes again.",
  },
  {
    title: "Save the codes immediately — losing a code may mean losing credits",
    body: "I understand that once the codes are displayed I should save them immediately in a safe place, because they may be shown only once, and losing them before use may mean losing access to the credits. For security and privacy reasons, Sealed does not store the codes in a form that would let the team recreate them manually.",
  },
  {
    title:
      "A code is not tied to a wallet before use — once used it assigns credits to the connected wallet",
    body: "I understand that a code is not assigned to my wallet in advance, so anyone holding the code can redeem it in the Sealed app. The code is redeemed directly in the app, and once used the credits are assigned to the wallet currently connected to the app, so before redeeming a code I should make sure I am using the correct wallet.",
  },
  {
    title: "Codes and credits have an expiration date",
    body: "I understand that a code is valid for one year from generation, and once used the received credits are valid for another year in the wallet. If a code is not used in time, or the received credits are not used within a year of being assigned to the wallet, the unused codes or credits are forfeited. This rule allows unused ALGO (e.g. from lost codes or wallets the user can no longer access) to be released or reclaimed from the smart contract for gas.",
  },
  {
    title: "Purchase and receipt of credits are visible on the blockchain",
    body: "I understand that both the purchase of credits and their receipt may be publicly visible on the Algorand blockchain, including the address that bought the credits and the address that received them. For greater privacy it is worth waiting some time between buying and receiving credits, because if more purchase and receipt transactions pass through the smart contract in that time, it will be harder to link the buying address with the receiving one.",
  },
];

export default function CollectingWalletStepFour({
  onStatusChange,
}: CollectingWalletStepFourProps) {
  const [checked, setChecked] = useState<boolean[]>(
    CONSENT_NOTES.map(() => false),
  );

  const allChecked = checked.every(Boolean);

  const toggle = (index: number) => {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <div className="flex items-center flex-col gap-6 h-full w-full flex flex-col items-center justify-between">
      <div className="flex flex-col gap-2 mr-auto w-full">
        <ConnectingWalletHeader
          title="Important information"
          subTitle="Read the notes below and confirm each one to continue."
        />

        <div className="overflow-hidden overflow-y-auto p-4 w-full h-[240px] scroll-y border border-[#262626] text-[#b3b3b3b]">
          {CONSENT_NOTES.map((note, index) => (
            <div key={index} className="flex flex-col mb-6">
              <p className="text-sm font-semibold text-white">
                {index + 1}. {note.title}
              </p>
              <div className="flex items-start gap-2 mt-2">
                <input
                  type="checkbox"
                  id={`consent-${index}`}
                  checked={checked[index]}
                  onChange={() => toggle(index)}
                  className="mt-1 w-4 h-4 shrink-0 cursor-pointer appearance-none bg-transparent border border-gray-500 rounded checked:bg-sealed-teal checked:border-sealed-teal accent-white"
                />
                <label
                  htmlFor={`consent-${index}`}
                  className="text-gray-400 cursor-pointer text-sm"
                >
                  {note.body}
                </label>
              </div>
            </div>
          ))}
        </div>

        {!allChecked ? (
          <div className="flex items-center gap-2 mt-3">
            <Image
              src="/assets/icons/red-triangle.svg"
              alt="red-triangle"
              width="16"
              height="16"
            />
            <p className="text-md text-red-500">
              Confirm all notes to continue
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-4 w-full justify-end">
        <button
          className="px-4 py-2 rounded-xl cursor-pointer bg-sealed-teal text-black disabled:bg-[#1f1f1f] disabled:border disabled:border-[rgba(255,255,255,0.2)] disabled:text-[rgba(255,255,255,0.2)]"
          onClick={() => onStatusChange?.(5)}
          disabled={!allChecked}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
