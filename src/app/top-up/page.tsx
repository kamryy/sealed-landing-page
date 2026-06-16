"use client";

import NavBar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConnectingWalletContainer from "@/components/top-up/ConnectingWalletContainer";
import { Providers } from "../providers";

export default function TopUpWalletPage() {
  return (
    <div className="relative h-full w-full">
      <Providers>
        <main className="max-h-screen relative overflow-x-hidden pb-12 pt-0 lg:px-12 lg:pt-6 min-h-screen">
          <div className="relative mx-auto w-full max-w-7xl overflow-visible">
            <NavBar />
            <section className="relative z-20 flex flex-col items-center px-4 py-10 sm:px-8 sm:py-25 w-full h-full">
              <ConnectingWalletContainer />
            </section>
            <Footer />
          </div>
        </main>
      </Providers>
    </div>
  );
}
