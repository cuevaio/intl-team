import localFont from 'next/font/local';

import type { Metadata } from 'next';

import './globals.css';

import { Providers } from '@/providers';

import { KeyMappings } from './key-mappings';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'INTL Team',
  description:
    "We're building tools to make the lives of INTL team members a lot easier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-[120%]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased`}
      >
        <Providers>
          <KeyMappings />
          <>{children}</>
          <div className="h-32"></div>
          <div className="absolute bottom-0 h-16 w-full text-center">
            <a
              href="https://cueva.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline"
            >
              © 2024 Anthony Cueva
            </a>
          </div>
        </Providers>
      </body>
    </html>
  );
}
