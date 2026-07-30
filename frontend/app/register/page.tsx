"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, CheckCircle2, User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("RECRUITER");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role_names: [role]
        }),
      });

      if (response.ok) {
        setSuccessMsg("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        const errData = await response.json().catch(() => ({}));
        setErrorMsg(errData.detail || "Registration failed. Try again.");
      }
    } catch (err) {
      setErrorMsg("Unable to connect to the backend server. Make sure the FastAPI server is running on http://localhost:8000");
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-xs text-muted">Join HireLens AI platform to manage candidates and resumes.</p>
        </div>

        {/* Form Container */}
        <div className="border border-border bg-card p-6 rounded-xl shadow-sm">
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Notifications */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2">
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted" htmlFor="firstName">First Name</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-3 h-3.5 w-3.5 text-muted/70" />
                  <input
                    id="firstName"
                    type="text"
                    required
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 bg-secondary/30 rounded-lg border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted" htmlFor="lastName">Last Name</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-3 h-3.5 w-3.5 text-muted/70" />
                  <input
                    id="lastName"
                    type="text"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 bg-secondary/30 rounded-lg border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-3 h-3.5 w-3.5 text-muted/70" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="jane.doe@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-secondary/30 rounded-lg border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-3 h-3.5 w-3.5 text-muted/70" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-secondary/30 rounded-lg border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted" htmlFor="role">Register as</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/30 rounded-lg border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
              >
                <option value="RECRUITER">Recruiter / Employer</option>
                <option value="CANDIDATE">Candidate / Job Seeker</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Registering...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted">Already have an account?</span>
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
