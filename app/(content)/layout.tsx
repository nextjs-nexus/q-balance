import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { headers } from "next/headers";

import { auth } from "../../lib/auth";
import MainMenu from '../../components/main-menu';
import LandingPage from "../../components/landing-page";

import { signOutAction } from '../../actions/auth';

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Q-Balance",
  description: "Track income and expenses for free with Q-Balance. Explore transaction lists, category reports, and a clearer view of your balance.",
};

type RootLayoutProps = {
  children: React.ReactNode
}

export default async function RootLayout({children}: RootLayoutProps) {

  const session = await auth.api.getSession({
      headers: await headers(),
  });

  if (!session) {
    return (
        <html lang="en" className="h-full antialiased">
          <body className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)]`}>
            <LandingPage />
          </body>
        </html>
    );
  }

  return (
    <html lang="en" className="h-full antialiased">
    <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-balance-canvas`}>
    <div className="min-h-dvh bg-balance-canvas">
      <div className="flex min-h-14 items-center justify-between gap-3 border-b border-balance-border bg-balance-surface px-4 sm:px-6 lg:px-10">
        <div className="order-first min-w-0 truncate text-sm text-balance-ink">
          <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
            <Image src="/logo.svg" loading="eager" alt="logo" className="[filter:brightness(0)_saturate(100%)_invert(20%)_sepia(19%)_saturate(1020%)_hue-rotate(110deg)]" width={30} height={30} />
            <span className="hidden lg:block font-bold text-lg">Q-Balance</span>
          </Link>
        </div>
        <div className="form-actions order-first min-w-0 text-sm text-balance-muted flex flex-row mb-3">
            <span className="hidden sm:inline mt-2">Logged in: </span>
            <span className='font-semibold mr-4 mt-2'>{session.user.name}</span>
            <Link href="/change-password" className="mr-4">Change password</Link>
            <form action={signOutAction}>
              <input type="submit" defaultValue="Logout" />
            </form>
        </div>
      </div>
      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-balance-canvas md:flex-row">
        <aside id="main-menu" className="z-20 w-full shrink-0 border-b border-balance-border bg-balance-primary px-3 py-2 md:sticky md:top-0 md:h-screen md:w-20 md:border-b-0 md:border-r md:p-4 lg:w-60">
          <MainMenu />
        </aside>
        <div id="main-content" className="min-w-0 flex-1 bg-balance-canvas">
          {children}
        </div>
      </div>
    </div>
    </body>
    </html>
  );

}
