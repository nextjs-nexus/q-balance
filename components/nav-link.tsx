'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LinkProps = {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children } : LinkProps ) {
  const path: string = usePathname();

  if ( !href ) {
    href = '/';
  }

 let classes: string ="flex min-h-11 items-center justify-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-slate-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 md:px-2 lg:justify-start";

 if ( path.startsWith(href) ) {
    classes += ' bg-blue-50 font-semibold text-[#0a2239]';
 }else{
    classes += ' font-normal text-[#c8d7e3]';
 }

  return (
    <Link href={href} className={`${classes}`}>
      {children}
    </Link>
  );
}
