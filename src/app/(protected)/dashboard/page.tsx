"use client";

import { useEffect } from "react";
import HomePage from "@/containers/home-page";

export default function DashboardPage() {
  useEffect(() => {
    // Double-check authentication on the page level
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("auth") === "true";
      if (!isLoggedIn) {
        window.location.replace("/login");
      }
    }
  }, []);

  // Check auth before rendering
  if (typeof window !== "undefined") {
    const isLoggedIn = localStorage.getItem("auth") === "true";
    if (!isLoggedIn) {
      return null; // Don't render anything if not logged in
    }
  }

  return <HomePage />;
}

