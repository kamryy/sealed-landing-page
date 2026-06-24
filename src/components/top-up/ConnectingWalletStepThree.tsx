"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useWallet } from "@txnlab/use-wallet-react";

import { algodClient } from "@/lib/algorand";
import { depositMany } from "@/services/MimcTopupService";
import ConnectingWalletModal from "@/components/top-up/ConnectingWalletModal";

interface CollectingWalletStepTwoProps {
  onStatusChange?: (step: number) => void;
  onQuantityChange?: (qty: number) => void;
  onCodesGenerated?: (codes: string[]) => void;
  quantity?: number;
}

export default function CollectingWalletStepThree({
  onStatusChange,
  onQuantityChange,
  onCodesGenerated,
  quantity,
}: CollectingWalletStepTwoProps) {
  const { activeAddress, signTransactions } = useWallet();

  const [selectedQuantity, setSelectedQuantity] = useState<string>(
    quantity ? String(quantity) : "",
  );
  const [algoCount, setAlgoCount] = useState<number>(0);

  const [messagesCount, setMessagesCount] = useState<number>(
    quantity ? quantity * 500 : 0,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [phase, setPhase] = useState<"signing" | "confirming">("signing");
  const [progress, setProgress] = useState<{ index: number; total: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const accountInfo = await algodClient
        .accountInformation(activeAddress as string)
        .do();
      setAlgoCount(Number(accountInfo.amount) / 1_000_000);
    };

    fetchBalance();
  }, [activeAddress]);

  const goNext = async () => {
    const qty = parseInt(selectedQuantity);

    if (!activeAddress) {
      setError("Connect Your wallet before the purchase.");
      return;
    }
    if (!qty) {
      setError("No quantity selected.");
      return;
    }

    onQuantityChange?.(qty);
    setError(null);

    try {
      // MiMC client-side: generate + deposit one code at a time. Each code is a
      // locally generated secret (the backup note) whose leaf is deposited into
      // the on-chain MiMC tree — no server pool, so quantity is unbounded.
      setPhase("signing");
      setProgress({ index: 1, total: qty });
      setModalOpen(true);
      const codes = await depositMany(
        qty,
        activeAddress,
        signTransactions,
        (p) => {
          setPhase(p.phase);
          setProgress({ index: p.index, total: p.total });
        },
      );
      onCodesGenerated?.(codes);
      setModalOpen(false);
      setProgress(null);
      onStatusChange?.(4);
    } catch (err) {
      setModalOpen(false);
      setProgress(null);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const truncateMiddle = (text: string | null, charsEachSide: number = 4) => {
    if (!text || text.length <= charsEachSide * 2) return text;
    return `${text.slice(0, charsEachSide)}......${text.slice(-charsEachSide)}`;
  };

  const countMessages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;

    // Allow empty input; otherwise keep digits only. No upper cap — MiMC codes
    // are generated client-side, so quantity is unbounded (one deposit/signature
    // per code; the buyer's balance is the only limit).
    if (raw === "") {
      setSelectedQuantity("");
      setMessagesCount(0);
      return;
    }

    const digits = raw.replace(/\D/g, "");
    if (digits === "") return;

    const qty = parseInt(digits);
    setSelectedQuantity(String(qty));
    setMessagesCount(qty * 500);
  };

  const countAlgo = (): number => {
    return parseInt(selectedQuantity) * 10 || 0;
  };

  const remaining = algoCount - countAlgo();
  const insufficient = remaining < 0;

  return (
    <div className="flex flex-1 flex-col gap-6 w-full items-center justify-between">
      <div className="flex flex-col gap-2 mr-auto">
        <p className="text-2xl sm:text-4xl font-bold ">Exchange ALGO for messages</p>
        <p className="text-base sm:text-xl text-[#b3b3b3]">
          10 ALGO gives you 1 Redeem Code - meaning{" "}
          <span className="text-sealed-teal">500</span> messages in Sealed
          ecosystem. <br />
          Enter the number of Redeem Code You would like to receive
        </p>

        <div className="flex gap-10 flex-col mt-5 text-[#b3b3b3]">
          <div
            className={`flex flex-col w-fit max-w-full sm:max-w-[280px] gap-2 rounded-xl px-4 py-3 border ${
              insufficient
                ? "border-red-500 bg-red-500/10"
                : "border-sealed-teal"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="bg-sealed-teal rounded-full w-fit p-1">
                <Image
                  src="/assets/icons/algo-icon.svg"
                  alt="algo-icon"
                  width="12"
                  height="12"
                />
              </div>
              <p
                className="text-sm text-zinc-400 overflow-hidden"
                style={{ maxWidth: "200px" }}
              >
                {truncateMiddle(activeAddress)}
              </p>
            </div>
            <p
              className={`text-lg font-bold ${
                insufficient ? "text-red-500" : "text-sealed-teal"
              }`}
            >
              {remaining.toFixed(3)} ALGO
            </p>
            {insufficient && (
              <p className="text-sm text-red-500 whitespace-normal break-words leading-snug">
                You don&apos;t have enough balance
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center  gap-4 sm:gap-8">
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-white">Code quantity</p>
              <input
                placeholder="Insert number of credits"
                className="w-full sm:w-fit bg-[#2a2a2a] border border-[#404040] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-sealed-teal transition"
                type="text"
                value={selectedQuantity}
                onChange={countMessages}
              />
              <p className="text-sm text-transparent ">
            x
              </p>
            </div>

            <Image
              src="/assets/icons/exchange-algo.svg"
              alt="exchange-algo-icon"
              width="16"
              height="16"
            />

            <div className="flex flex-col items-start sm:items-end gap-2">
              <p className="text-sm text-white">
                Message received in Sealed app
              </p>
              <input
                placeholder="0"
                className="w-full text-center bg-[#2a2a2a] border border-[#404040] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none border-sealed-teal transition"
                type="text"
                disabled
                value={messagesCount.toString()}
              />
              <p className="text-sm text-zinc-400">
                <span className="font-bold text-white">{countAlgo()} ALGO</span>{" "}
                for purchase
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="flex items-center gap-2 mt-3">
            <Image
              src="/assets/icons/red-triangle.svg"
              alt="red-triangle"
              width="16"
              height="16"
            />
            <p className="text-md text-red-500">{error}</p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-4 w-full justify-between">
        <button
          className="px-6 py-3 rounded-xl cursor-pointer border border-[rgba(255,255,255,0.2)] "
          onClick={() => onStatusChange?.(2)}
        >
          Back
        </button>

        <button
          className="px-4 py-2 rounded-xl cursor-pointer bg-sealed-teal text-black disabled:opacity-20 disabled:cursor-not-allowed"
          onClick={goNext}
          disabled={(selectedQuantity === "" && countAlgo() === 0) || insufficient}
        >
          Top up
        </button>
      </div>

      {modalOpen && (
        <ConnectingWalletModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          headerText={"Transaction"}
          contentText={
            phase === "signing"
              ? `Approve code ${progress?.index ?? 1} of ${progress?.total ?? 1} in Your wallet`
              : `Code ${progress?.index ?? 1} of ${progress?.total ?? 1} signed. Waiting for on-chain confirmation...`
          }
          contentHeaderText={
            phase === "signing"
              ? "Waiting for Transaction"
              : "Confirming Transaction"
          }
          isLoadingModal={true}
        />
      )}
    </div>
  );
}
