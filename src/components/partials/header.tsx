"use client";

import { useState } from "react";
import Image from "next/image";
import { Power } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  return (
    <>
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
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="cursor-pointer text-destructive hover:text-destructive/70 transition-colors"
                aria-label="Logout"
              >
                <Power className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Logout</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to sign in again to
              access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground"
            >
              Yes, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
