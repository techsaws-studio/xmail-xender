"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "@/components/partials/header";

export function ConditionalHeader() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Don't show header on login page
  if (!isMounted || pathname === "/login") {
    return null;
  }
  
  return <Header />;
}

