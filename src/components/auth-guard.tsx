"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("auth") === "true";

    if (!isLoggedIn) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null; // block page render until auth confirmed

  return <>{children}</>;
}
