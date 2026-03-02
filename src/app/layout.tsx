import type { Metadata } from 'next';
import { DM_Sans, Lexend } from 'next/font/google';
import './globals.css';

const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
      <body className={`${lexend.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
