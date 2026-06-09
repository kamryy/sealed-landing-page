"use client";

import { useState } from "react";
import Image from "next/image";
import ConnectingWalletModal from "@/components/top-up/ConnectingWalletModal";
import { useWallet, Wallet } from "@txnlab/use-wallet-react";
import ConnectingWalletHeader from "./ConnectingWalletHeader";

interface CollectingWalletStepOneProps {
  onStatusChange?: (step: number) => void;
}

export default function CollectingWalletStepOne({
  onStatusChange,
}: CollectingWalletStepOneProps) {
  const { wallets } = useWallet();

  const [selectedWallet, setSelectedWallet] = useState<Wallet>();
  const [connectWalletModalOpen, setConnectWalletModalOpen] = useState(false);

  const openModal = () => {
    setConnectWalletModalOpen(true);
    selectedWallet?.connect();
  };

  const connectWallet = (wallet: Wallet) => {
    setSelectedWallet(wallet);
  };

  const onCloseModalHandler = () => {
    setConnectWalletModalOpen(false);
    onStatusChange?.(2);
  };

  return (
    <div className="flex items-center flex-col gap-4">
      <ConnectingWalletHeader
        title="Connect Wallet"
        subTitle="Get started by connecting Your prefered wallet"
      />

      <div className="mt-6 mb-12 flex items-center gap-4">
        {wallets.map((w) => (
          <button
            onClick={() => connectWallet(w)}
            key={w.id}
            className={`w-[200px] h-[200px] flex items-center focus:border focus:border-sealed-teal bg-[#262626] hover:bg-[#333333] justify-center cursor-pointer gap-4 mb-4 flex-col rounded-lg ${
              selectedWallet?.id === w.metadata.name
                ? "border border-sealed-teal"
                : ""
            }`}
          >
            <Image
              src={w.metadata.icon}
              alt={w.metadata.icon}
              width={24}
              height={24}
            />
            {w.metadata.name}
          </button>
        ))}
      </div>

      <button
        className="px-4 py-2 ml-auto rounded-xl cursor-pointer bg-sealed-teal text-black disabled:border disabled:opacity-20 disabled:bg-gray-500 disabled:cursor-not-allowed"
        disabled={!selectedWallet}
        onClick={openModal}
      >
        Connect wallet
      </button>

      {connectWalletModalOpen && (
        <ConnectingWalletModal
          walletName={selectedWallet?.id}
          isOpen={connectWalletModalOpen}
          onClose={onCloseModalHandler}
          headerText={"Connecting"}
          contentText="Please approve connecting"
          contentHeaderText="Connecting"
        />
      )}
    </div>
  );
}
