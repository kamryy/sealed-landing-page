"use client";
import { createPortal } from "react-dom";
import { useEffect, useSyncExternalStore } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  walletName?: string;
  headerText: string;
  contentText?: string;
  contentHeaderText?: string;
  isLoadingModal: boolean,
  isFinishModal?: boolean,
  onFinish?: () => void,
  goBack?: () => void
}

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function ConnectingWalletModal({
  isOpen,
  onClose,
  onFinish,
  goBack,
  walletName,
  headerText,
  contentText,
  contentHeaderText,
  isLoadingModal,
  isFinishModal
}: Props) {
  const { activeWallet } = useWallet();

  const mounted = useIsMounted();

  useEffect(() => {
    if (activeWallet?.isActive) {
      onClose();
    }
  }, [activeWallet?.isActive, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[900]">
      <div className="rounded-2xl p-8 w-full max-w-md flex flex-col items-center relative">
        <div className="py-4 px-6 flex items-center justify-between w-full bg-[#141414] border-b border-[rgba(255,255,255,0.1)] px-4 py-2 rounded-t-lg">
          <p className="text-white text-xl">{headerText}</p>
          <button
            onClick={onClose}
            className=" px-2 py-1 text-gray-400 bg-[#262626] rounded-full cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="py-10 px-4 relative flex align-center gap-4 w-full justify-between flex-col bg-[#1a1a1a] rounded-b-lg">
         {isLoadingModal && <div className="flex gap-1 align-center justify-center">
            <span className="w-2 h-2 bg-sealed-teal rounded-full animate-pulse [animation-delay:0ms]" />
            <span className="w-2 h-2 bg-sealed-teal rounded-full animate-pulse [animation-delay:300ms]" />
            <span className="w-2 h-2 bg-sealed-teal rounded-full animate-pulse [animation-delay:600ms]" />
          </div> }
          {isFinishModal && <div className="flex gap-1 align-center justify-center"> <Image className="text-center" src="/assets/icons/no-docs.svg" alt="no-documents" width="16" height="16" /></div>}

          <h3 className={`${isFinishModal ? 'text-red-500' : 'text-sealed-teal'}  text-center text-xl font-semibold`}>
            {contentHeaderText} {walletName ? `${walletName} Wallet` : null}
          </h3>
          <p className={`${isFinishModal ? 'text-left' : 'text-center' } text-gray-400 text-sm `}>
            {contentText} {walletName ? `${walletName} wallet` : null}
          </p>


          {isFinishModal &&
          <div className="flex items-center justify-between">
          <button onClick={goBack} className="px-6 py-3 rounded-xl cursor-pointer border border-[rgba(255,255,255,0.2)] ">
            Back
          </button>
          <button onClick={onFinish} className="px-6 py-3 rounded-xl cursor-pointer border border-red-500 text-red-500 ">
            Finish anyway
          </button>
          </div> 
          }
        </div>
      </div>
    </div>,
    document.body,
  );
}
