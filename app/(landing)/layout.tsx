import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';

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
  description: "Track income and expenses for free with Q-Balance. Browse sample data without an account, then sign up to keep your own records.",
};

type LandingLayoutProps = {
  children: React.ReactNode
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)]`}>
        {children}
      </body>
    </html>
  );
}
