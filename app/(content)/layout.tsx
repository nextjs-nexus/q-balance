import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { headers } from "next/headers";

import { auth } from "../../lib/auth";
import MainMenu from '../../components/main-menu';

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
  description: "Quick Balance NextJS App",
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
          <body>
            <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4">
              <Image src="/logo.svg" style={{ filter: 'invert(5%) sepia(100%) saturate(10000%) hue-rotate(200deg)' }} width={44} height={44} alt="Q-Balance" />
              <h1 className="text-4xl font-bold">Free Accounting Software</h1>
              <h2><strong>Q-Balance</strong> is a free, open-source, and online accounting software for individuals, small businesses and freelancers.</h2>
              <div className="form-actions flex gap-4 mt-8">
                  <Link className="form-actions" href="/signup">Create account</Link>
                  <Link className="form-actions" href="/signin">Sign In</Link>
              </div>
            </div> 
          </body>
        </html>
    );
  }

  return (
    <html lang="en" className="h-full antialiased">
    <body className="min-h-dvh bg-slate-50">
    <div className="min-h-dvh bg-slate-50">      
      <div className="flex min-h-14 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-10">
        <div className="order-first min-w-0 truncate text-sm text-[#1c5b88]">
          <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
            <Image src="/logo.svg" loading="eager" alt="logo" style={{ filter: 'invert(5%) sepia(100%) saturate(10000%) hue-rotate(200deg)' }} width={30} height={30} />
            <span className="hidden lg:block font-bold text-lg">Q-Balance</span>
          </Link>
        </div>
        <div className="form-actions order-first min-w-0 text-sm text-gray-600 flex flex-row mb-3">
            <span className="hidden sm:inline mt-2">Logged in: </span>
            <span className='font-semibold mr-4 mt-2'>{session.user.name}</span>
            <Link href="/change-password" className="mr-4">Change password</Link>
            <form action={signOutAction}>
              <input type="submit" defaultValue="Logout" />
            </form>
        </div>
      </div>
      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-slate-50 md:flex-row">
        <aside id="main-menu" className="z-20 w-full shrink-0 border-b border-gray-200 bg-[#0a2239] px-3 py-2 md:sticky md:top-0 md:h-screen md:w-20 md:border-b-0 md:border-r md:p-4 lg:w-60">
          <MainMenu />
        </aside>
        <div id="main-content" className="min-w-0 flex-1 bg-slate-50">
          {children}
        </div>
      </div>
    </div>
    </body>
    </html>
  );

}
