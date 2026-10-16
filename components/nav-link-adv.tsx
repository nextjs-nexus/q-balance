'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LinkProps = {
  href: string;
  image: string;
  children: React.ReactNode;
}

export default function NavLinkAdv({ href, image, children } : LinkProps ) {
  const path: string = usePathname();

  if ( !href ) {
    href = '/';
  }

 let classes: string ="flex min-h-11 items-center justify-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-slate-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 md:px-2 lg:justify-start";
 let invertit:string = 'opacity(70%) invert(100%) sepia(0%) saturate(100%) hue-rotate(0deg)';

 if ( path.startsWith(href) ) {
    classes += ' bg-blue-50 font-semibold text-[#0a2239]';
    invertit = 'opacity(70%) invert(0%) sepia(0%) saturate(100%) hue-rotate(0deg)';
 }else{
    classes += ' font-normal text-[#c8d7e3]';
 }

  return (
    <Link href={href} className={`${classes}`}>
      <Image src={image} loading="eager" width={20} height={20} style={{ filter: `${invertit}`}} alt="New Item" />
      {children}
    </Link>
  );
}
