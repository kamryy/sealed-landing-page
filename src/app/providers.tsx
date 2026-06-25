"use client";
import { useEffect } from "react";
import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from "@txnlab/use-wallet-react";

// Wallet network MUST match the algod/app the deposit targets (NEXT_PUBLIC_ALGO_NETWORK).
// A mismatch (e.g. wallet on testnet, deposit built for mainnet) confuses the user and
// some wallets refuse to sign a txn whose genesis ≠ their active network.
const TARGET_NETWORK =
  process.env.NEXT_PUBLIC_ALGO_NETWORK === "testnet"
    ? NetworkId.TESTNET
    : NetworkId.MAINNET;

const manager = new WalletManager({
  wallets: [WalletId.PERA, WalletId.DEFLY, WalletId.LUTE],
  defaultNetwork: TARGET_NETWORK,
});

export function Providers({ children }: { children: React.ReactNode }) {
  // use-wallet persists the last active network in localStorage, which overrides
  // defaultNetwork across builds — so a prior testnet session would leave the wallet
  // on testnet even after switching the build to mainnet. Force the build's target
  // network on mount so the persisted value can never win.
  useEffect(() => {
    if (manager.activeNetwork !== TARGET_NETWORK) {
      void manager.setActiveNetwork(TARGET_NETWORK);
    }
  }, []);

  return <WalletProvider manager={manager}>{children}</WalletProvider>;
}
