import type { Metadata } from 'next';
import { Readex_Pro } from 'next/font/google';
import './globals.css';

const readexPro = Readex_Pro({
  variable: '--font-readex-pro',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Sealed - Fully Anonymous Multi-Chain Messenger',
  description:
    'Fully anonymous, multi-chain end-to-end messenger. Coming soon.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${readexPro.variable} antialiased`}>{children}</body>
    </html>
  );
}
