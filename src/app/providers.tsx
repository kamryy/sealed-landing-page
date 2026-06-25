"use client";
import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from "@txnlab/use-wallet-react";

// Wallet network MUST match the algod/app the deposit targets (NEXT_PUBLIC_ALGO_NETWORK).
// A mismatch (e.g. wallet on testnet, deposit built for mainnet) confuses the user and
// some wallets refuse to sign a txn whose genesis ≠ their active network.
const manager = new WalletManager({
  wallets: [WalletId.PERA, WalletId.DEFLY, WalletId.LUTE],
  defaultNetwork:
    process.env.NEXT_PUBLIC_ALGO_NETWORK === "testnet"
      ? NetworkId.TESTNET
      : NetworkId.MAINNET,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider manager={manager}>{children}</WalletProvider>;
}
