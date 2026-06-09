"use client";

import { useEffect, useState } from "react";
import ConnectingWalletModal from "@/components/top-up/ConnectingWalletModal";
import Image from "next/image";
import { useWallet } from "@txnlab/use-wallet-react";
import { purchase } from "@/services/PurchaseService";

import { algodClient } from "@/lib/algorand";

interface CollectingWalletStepTwoProps {
  onStatusChange?: (step: number) => void;
}

export default function CollectingWalletStepThree({
  onStatusChange,
}: CollectingWalletStepTwoProps) {
  const { activeAddress, signTransactions } = useWallet();

  //test
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  //test

  const [selectedQuantity, setSelectedQuantity] = useState<string>("");
  const [algoCount, setAlgoCount] = useState<number>(0);

  const [messagesCount, setMessagesCount] = useState<number>(0);
  const [connectWalletModalOpen, setConnectWalletModalOpen] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      const accountInfo = await algodClient
        .accountInformation(activeAddress as string)
        .do();
      setAlgoCount(Number(accountInfo.amount) / 1_000_000);
    };

    fetchBalance();
  }, [activeAddress]);

  const openModal = async () => {
    setConnectWalletModalOpen(true);

    if (!activeAddress) {
      setError("Połącz portfel przed zakupem.");
      return;
    }

    setStatus("pending");
    setError(null);

    try {
      /*const result =*/ await purchase(
        parseInt(selectedQuantity),
        activeAddress,
        signTransactions,
      ).then(() => {
        setConnectWalletModalOpen(false);
        onStatusChange?.(4);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd");
      setStatus("error");
    }
  };

  const truncateMiddle = (text: string | null, charsEachSide: number = 4) => {
    if (!text || text.length <= charsEachSide * 2) return text;
    return `${text.slice(0, charsEachSide)}......${text.slice(-charsEachSide)}`;
  };

  const countMessages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedQuantity(value);
    setAlgoCount(algoCount - parseInt(value) * 10);
    setMessagesCount(parseInt(value) * 500 || 0);
  };

  const onCloseModalHandler = () => {
    console.log("on closemodal handler");
    // setConnectWalletModalOpen(false);
    // onStatusChange?.(4);
  };

  const countAlgo = (): number => {
    return parseInt(selectedQuantity) * 10 || 0;
  };

  return (
    <div className="flex items-center flex-col gap-6 h-full w-full flex flex-col items-center justify-between">
      <div className="flex flex-col gap-2 mr-auto">
        <p className="text-4xl font-bold ">Exchange ALGO for messages</p>
        <p className="text-xl text-[#b3b3b3]">
          10 ALGO gives you 1 Redeem Code - meaning{" "}
          <span className="text-sealed-teal">500</span> messages in Sealed
          ecosystem. <br />
          Enter the number of Redeem Code You would like to receive
        </p>

        <div className="flex gap-10 flex-col mt-5 text-[#b3b3b3]">
          <div className="flex flex-col border border-sealed-teal w-fit gap-2 rounded-lg px-4 py-3">
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
            <p className="text-lg font-bold text-sealed-teal">
              {algoCount.toFixed(3)} ALGO
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-sm text-white">Code quantity</p>
              <input
                placeholder="Insert number of credits"
                className="w-fit bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-sealed-teal transition"
                type="text"
                value={selectedQuantity}
                onChange={countMessages}
              />
            </div>

            <Image
              src="/assets/icons/exchange-algo.svg"
              alt="exchange-algo-icon"
              width="16"
              height="16"
            />

            <div className="flex flex-col items-end">
              <p className="text-sm text-white">
                Message received in Sealed app
              </p>
              <input
                placeholder="0"
                className="w-full text-center bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none border-sealed-teal transition"
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
      </div>

      <div className="flex items-center gap-4 w-full justify-between">
        <button
          className="px-6 py-3 rounded-xl cursor-pointer border border-[rgba(255,255,255,0.2)] "
          onClick={() => onStatusChange?.(2)}
        >
          Back
        </button>

        <button
          className="px-4 py-2 rounded-xl cursor-pointer bg-sealed-teal text-black"
          onClick={openModal}
          disabled={selectedQuantity === "" && countAlgo() === 0}
        >
          Top up
        </button>
      </div>
      {connectWalletModalOpen && (
        <ConnectingWalletModal
          isOpen={connectWalletModalOpen}
          onClose={onCloseModalHandler}
          headerText={"Transaction"}
          contentText={"Please approve the transaction in Your wallet"}
          contentHeaderText={"Waiting for Transaction"}
        />
      )}
    </div>
  );
}
