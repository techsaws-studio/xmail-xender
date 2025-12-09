"use client";

import Image from "next/image";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import { cn } from "@/lib/utils";

import { Power } from "lucide-react";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "w-full h-[90px] bg-card border-b border-border",
        className
      )}
    >
      <div className="layout-standard h-full flex items-center justify-between">
        <Image
          src="/logo.svg"
          alt="Xmail Xender"
          className="opacity-90"
          height={60}
          width={60}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Power
              onClick={() => {
                localStorage.removeItem("auth");
                window.location.href = "/login";
              }}
              className="cursor-pointer text-destructive hover:text-destructive/70"
            />
          </TooltipTrigger>
          <TooltipContent>Logout</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
