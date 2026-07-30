"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, Lock, Mail, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Attempt login
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
        setSuccessMsg("Authentication successful! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        // If user not found and it looks like a demo email, try to auto-register first for a smooth out-of-the-box demo
        if (response.status === 401 && (email === "demo@hirelens.ai" || email.includes("demo"))) {
          setErrorMsg("Demo user not found. Attempting to auto-create credentials...");
          
          const regResponse = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              first_name: "Demo",
              last_name: "Recruiter",
              role_names: ["RECRUITER"]
            }),
          });

          if (regResponse.ok) {
            // Register succeeded, try logging in again
            const loginRetry = await fetch(`${API_BASE_URL}/api/v1/auth/login-json`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });
            
            if (loginRetry.ok) {
              const retryData = await loginRetry.json();
              localStorage.setItem("accessToken", retryData.access_token);
              localStorage.setItem("refreshToken", retryData.refresh_token);
              setSuccessMsg("Demo credentials generated and logged in!");
              setTimeout(() => {
                router.push("/dashboard");
              }, 1200);
              return;
            }
          }
        }
        
        const errData = await response.json().catch(() => ({}));
        setErrorMsg(errData.detail || "Authentication failed. Check credentials.");
      }
    } catch (err) {
      setErrorMsg(`Unable to connect to the backend server at ${API_BASE_URL}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreFill = (role: "recruiter" | "candidate") => {
    if (role === "recruiter") {
      setEmail("demo@hirelens.ai");
      setPassword("password123");
    } else {
      setEmail("candidate@hirelens.ai");
      setPassword("password123");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 relative">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1.5 font-medium">
          ← Back to home
        </Link>
      </div>
      <div className="w-full max-w-[400px] space-y-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
            HL
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-xs text-muted">Enter your credentials to access your HireLens workspace.</p>
        </div>

        {/* Form Container */}
        <div className="border border-border bg-card p-6 rounded-xl shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Notifications */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2 animate-shake">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-success text-xs flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted/70" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-secondary/30 rounded-lg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted" htmlFor="password">Password</label>
                <a href="#" className="text-[10px] text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted/70" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-secondary/30 rounded-lg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted">Don't have an account?</span>
            <Link href="/register" className="text-primary font-semibold hover:underline">Register</Link>
          </div>
        </div>

        {/* Demo Fast Logins */}
        <div className="border border-border bg-card p-4 rounded-xl space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted block text-center">Demo Sandbox Profiles</span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handlePreFill("recruiter")}
              className="py-2 px-3 border border-border rounded-lg bg-secondary/20 hover:bg-secondary/40 text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-primary" /> Recruiter Demo
            </button>
            <button
              onClick={() => handlePreFill("candidate")}
              className="py-2 px-3 border border-border rounded-lg bg-secondary/20 hover:bg-secondary/40 text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-emerald-500" /> Candidate Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
