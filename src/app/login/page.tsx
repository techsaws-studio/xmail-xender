"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Single user credentials (no backend needed)
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "1234";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  // Log when component mounts
  useEffect(() => {
    console.log("✅ LOGIN PAGE COMPONENT MOUNTED");
    console.log("Current URL:", window.location.href);
  }, []);

  // Don't auto-redirect if already logged in - let user stay on login page
  // They can manually go to /dashboard or login again

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Simple client-side authentication (no backend)
    if (user.trim() === VALID_USERNAME && pass === VALID_PASSWORD) {
      console.log("Login successful!");
      localStorage.setItem("auth", "true");
      // Set cookie for server-side middleware check
      document.cookie = "auth=true; path=/; max-age=86400"; // 24 hours
      // Redirect to dashboard (email sender) after successful login
      window.location.href = "/dashboard";
    } else {
      console.log("Login failed!");
      setError("Invalid username or password. Please try again.");
      setPass("");
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  }

  // Render login form immediately - NO loading state
  return (
    <div 
      style={{ 
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#f1f5f9",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        width: "100%",
        overflow: "auto"
      }}
    >
      <Card 
        style={{ 
          maxWidth: "400px", 
          width: "100%", 
          backgroundColor: "white",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}
      >
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/logo.svg" alt="Xmail Xender" height={60} width={60} />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access Xmail Xender</CardDescription>
          <div style={{ 
            marginTop: "10px", 
            padding: "12px", 
            backgroundColor: "#3b82f6", 
            borderRadius: "6px",
            fontSize: "14px",
            color: "white",
            fontWeight: "bold"
          }}>
            🔒 LOGIN PAGE ACTIVE 
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="username"
                required
                autoFocus
                style={{ fontSize: "16px", padding: "10px" }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="current-password"
                required
                style={{ fontSize: "16px", padding: "10px" }}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" style={{ padding: "12px", fontSize: "16px" }}>
              Login
            </Button>
            
            <div className="text-xs text-center text-muted-foreground mt-4">
              
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("auth");
                  window.location.href = "/login";
                }}
                className="mt-2 text-primary hover:underline"
                style={{ fontSize: "12px", cursor: "pointer" }}
              >
                Clear authentication & reload
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
