"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    // IMMEDIATELY redirect root to login page - no delay
    if (typeof window !== "undefined") {
      // Use replace to avoid adding to history
      window.location.replace("/login");
    }
  }, []);

  // Show nothing while redirecting
  return null;
}

