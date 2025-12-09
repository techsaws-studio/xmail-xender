// src/app/(protected)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // whether we've finished checking localStorage
  const [ready, setReady] = useState(false);

  // whether user is allowed to see protected pages
  const [allowed, setAllowed] = useState(false);

  const checkAuth = () => {
    try {
      // Ensure we're on the client side
      if (typeof window === "undefined") {
        return false;
      }

      // Check both localStorage and cookie
      const isLoggedIn = localStorage.getItem("auth") === "true";
      const hasAuthCookie = document.cookie.split(";").some(c => c.trim().startsWith("auth=true"));

      if (!isLoggedIn || !hasAuthCookie) {
        // not logged in → kick to /login (use window.location for immediate redirect)
        window.location.replace("/login");
        setAllowed(false);
        return false;
      } else {
        setAllowed(true);
        return true;
      }
    } catch (e) {
      // if anything goes wrong, be safe and treat as not logged in
      window.location.replace("/login");
      setAllowed(false);
      return false;
    }
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      return;
    }

    // Check auth IMMEDIATELY and synchronously - don't wait
    const isAuthenticated = checkAuth();
    
    // Only set ready if authenticated, otherwise redirect is happening
    if (isAuthenticated) {
      setReady(true);
    } else {
      // Not authenticated - redirect is happening, don't set ready
      return;
    }

    // Listen for storage changes (e.g., logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth") {
        checkAuth();
      }
    };

    // Also check on focus (when user returns to tab)
    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [router]);

  // CRITICAL: Don't render ANYTHING until auth is confirmed
  // This prevents any content from showing before redirect
  if (!ready || !allowed) {
    // Show nothing - redirect is happening or checking
    return null;
  }

  // Only render children if authenticated
  return <>{children}</>;
}
