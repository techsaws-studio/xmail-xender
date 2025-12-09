"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("w-full h-[90px] bg-card border-b border-border flex-center", className)}>
      <Image src="/logo.svg" alt="Xmail Xender" className="opacity-90" height={60} width={60}/>
    </header>
  );
}
