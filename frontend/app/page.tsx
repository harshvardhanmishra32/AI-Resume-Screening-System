"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  CheckCircle, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  BrainCircuit, 
  UserCheck, 
  Sun, 
  Moon, 
  Search,
  Filter,
  Activity,
  AlertTriangle
} from "lucide-react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"recruiters" | "candidates">("recruiters");
  
  // Mock data for interactive dashboard demo
  const mockCandidates = [
    { name: "Sarah Jenkins", role: "Senior Frontend Engineer", score: 94, matchingSkills: ["React 19", "Next.js", "TypeScript", "Tailwind CSS"], missingSkills: ["GraphQL"], fraudStatus: "Clear" },
    { name: "David Chen", role: "AI/ML Scientist", score: 88, matchingSkills: ["Python", "PyTorch", "scikit-learn", "NLP"], missingSkills: ["Docker"], fraudStatus: "Clear" },
    { name: "Alex Mercer", role: "DevOps Architect", score: 81, matchingSkills: ["AWS", "Kubernetes", "CI/CD"], missingSkills: ["Terraform"], fraudStatus: "White Text Stuffing" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              HL
            </div>
            <span className="font-semibold text-lg tracking-tight">HireLens <span className="text-primary font-normal">AI</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Platform Demo</a>
            <a href="#docs" className="hover:text-foreground transition-colors">Developers</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Toggle Theme"
            >
              <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
            </button>

            <a 
              href="http://localhost:8000/api/v1/docs" 
              target="_blank" 
              className="text-xs font-semibold px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors hidden sm:inline-block"
            >
              API Reference
            </a>
            
            <a 
              href="/login"
              className="text-xs font-semibold px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary text-xs font-medium mb-6 text-muted-foreground"
          >
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            <span>AI-Driven Resume Matching & Intelligence</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl leading-[1.08] mb-6"
          >
            Screen candidate resumes with <span className="text-primary">true semantic intelligence</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-muted max-w-[65ch] leading-relaxed mb-10"
          >
            HireLens AI parses resumes, extracts core skills, measures relevance via semantic cosine similarity, and screens for recruiter-alerting fraud triggers instantly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a 
              href="/login"
              className="h-11 px-6 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-95 transition-all text-sm"
            >
              Recruiter Demo Console <ArrowRight className="h-4 w-4" />
            </a>
            <a 
              href="http://localhost:8000/api/v1/docs" 
              target="_blank"
              className="h-11 px-6 rounded-lg border border-border bg-card font-medium flex items-center justify-center gap-2 hover:bg-secondary transition-colors text-sm"
            >
              Developers API
            </a>
          </motion.div>
        </div>
      </section>

      {/* Interactive Showcase Section */}
      <section id="demo" className="py-16 bg-secondary/30 border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Interactive Platform Demo</h2>
            <p className="text-sm text-muted mt-2">See how our custom weighted scoring models and fraud detection trigger systems behave in real-time.</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg p-1 bg-secondary border border-border">
              <button 
                onClick={() => setActiveTab("recruiters")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === "recruiters" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
              >
                Recruiter View
              </button>
              <button 
                onClick={() => setActiveTab("candidates")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === "candidates" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
              >
                Candidate View
              </button>
            </div>
          </div>

          {activeTab === "recruiters" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recruiter Sidebar / Jobs list */}
              <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                  <span className="font-semibold text-sm">Active Job Openings</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">Admin Mode</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg border border-primary/20 bg-accent/40 cursor-pointer">
                    <h3 className="font-semibold text-xs text-primary">Senior Frontend Engineer</h3>
                    <p className="text-[10px] text-muted mt-1">Tech Stack: React, Next.js, TypeScript, Tailwind</p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-border hover:bg-secondary/40 cursor-not-allowed">
                    <h3 className="font-semibold text-xs">AI/ML Research Scientist</h3>
                    <p className="text-[10px] text-muted mt-1">Tech Stack: PyTorch, scikit-learn, spaCy, NLP</p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-border hover:bg-secondary/40 cursor-not-allowed">
                    <h3 className="font-semibold text-xs">DevOps Engineer</h3>
                    <p className="text-[10px] text-muted mt-1">Tech Stack: AWS, Kubernetes, Terraform</p>
                  </div>
                </div>
              </div>

              {/* Candidates Table (Ashby / Linear design) */}
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-6">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">Screened & Ranked Candidates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="h-3.5 w-3.5 text-muted absolute left-3 top-2.5" />
                      <input 
                        type="text" 
                        placeholder="Search candidate..." 
                        className="pl-8 pr-3 py-1.5 rounded-lg border border-border bg-secondary text-xs focus:outline-none focus:ring-1 focus:ring-primary w-40"
                      />
                    </div>
                    <button className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary">
                      <Filter className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-muted border-b border-border pb-3">
                        <th className="py-2.5 font-medium">Candidate Name</th>
                        <th className="py-2.5 font-medium">Matching Score</th>
                        <th className="py-2.5 font-medium">Skills Map</th>
                        <th className="py-2.5 font-medium">Verification Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockCandidates.map((candidate, idx) => (
                        <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                          <td className="py-4">
                            <span className="font-semibold block">{candidate.name}</span>
                            <span className="text-[10px] text-muted">{candidate.role}</span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${candidate.score >= 85 ? "text-success" : "text-warning"}`}>
                                {candidate.score}%
                              </span>
                              <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${candidate.score >= 85 ? "bg-success" : "bg-warning"}`} 
                                  style={{ width: `${candidate.score}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {candidate.matchingSkills.slice(0, 2).map((skill, i) => (
                                <span key={i} className="text-[9px] px-1.5 py-0.5 bg-secondary border border-border rounded font-medium">
                                  {skill}
                                </span>
                              ))}
                              {candidate.matchingSkills.length > 2 && (
                                <span className="text-[9px] text-muted font-medium">
                                  +{candidate.matchingSkills.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4">
                            {candidate.fraudStatus === "Clear" ? (
                              <span className="inline-flex items-center gap-1.5 text-success font-medium">
                                <CheckCircle className="h-3.5 w-3.5" /> Checked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-destructive font-medium animate-pulse">
                                <ShieldAlert className="h-3.5 w-3.5" /> {candidate.fraudStatus}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Candidate Upload */}
              <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6">
                <div className="pb-4 border-b border-border mb-6">
                  <span className="font-semibold text-sm">Upload Resume</span>
                  <p className="text-[10px] text-muted mt-1">Check your ATS score and extract details instantly.</p>
                </div>
                
                <div className="border border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center bg-secondary/10 hover:bg-secondary/20 transition-all cursor-pointer">
                  <FileText className="h-8 w-8 text-primary/70 mb-3" />
                  <span className="text-xs font-semibold block">Drop your resume here</span>
                  <span className="text-[9px] text-muted mt-1">Supports PDF, DOCX (Max 5MB)</span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs py-2 border-b border-border">
                    <span className="text-muted">Filename</span>
                    <span className="font-semibold">john_doe_cv_v2.pdf</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2">
                    <span className="text-muted">Extracted Name</span>
                    <span className="font-semibold">John Doe</span>
                  </div>
                </div>
              </div>

              {/* Candidate Scoring Analysis */}
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                  <span className="font-semibold text-sm">AI Feedback & ATS Score Report</span>
                  <span className="text-xs font-semibold text-success bg-success/15 px-2.5 py-0.5 rounded-full">Score: 92%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-xs text-primary mb-3">Skill Gap Findings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded border border-border bg-secondary/30">
                        <span className="text-xs font-medium">React 19 / Suspense</span>
                        <span className="text-[10px] text-success font-semibold">Matched</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded border border-border bg-secondary/30">
                        <span className="text-xs font-medium">Next.js App Router</span>
                        <span className="text-[10px] text-success font-semibold">Matched</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded border border-border bg-secondary/30">
                        <span className="text-xs font-medium">Tailwind CSS v4</span>
                        <span className="text-[10px] text-warning font-semibold">Missing</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-primary mb-3">Improvement Suggestions</h4>
                    <ul className="text-xs space-y-3 text-muted">
                      <li className="flex items-start gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>Quantify metrics inside your experience summary (e.g. "improved loading speed by 35%").</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>Link your GitHub and add reference URLs for the listed portfolio items.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AI Pipeline Architecture Info */}
      <section id="features" className="py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight">AI & Matching Pipeline</h2>
            <p className="text-sm text-muted mt-2">HireLens AI uses a combination of local NLP models and semantic transformers to parse and match resumes without cloud latency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-border bg-card p-6 rounded-xl hover:shadow-sm transition-all">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm mb-2">Entity Extraction (spaCy)</h3>
              <p className="text-xs text-muted leading-relaxed">Extracts structured contact details, name, email, phone numbers, and section mapping (Experience, Projects, Education) locally.</p>
            </div>

            <div className="border border-border bg-card p-6 rounded-xl hover:shadow-sm transition-all">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm mb-2">Semantic Matching (BERT)</h3>
              <p className="text-xs text-muted leading-relaxed">Computes high-dimensional cosine similarity embeddings utilizing sentence transformers (`all-MiniLM-L6-v2`) to measure candidate capability.</p>
            </div>

            <div className="border border-border bg-card p-6 rounded-xl hover:shadow-sm transition-all">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm mb-2">Resume Fraud Scanner</h3>
              <p className="text-xs text-muted leading-relaxed">Scans documents for hidden keyword stuffing, repetitive placeholder phrases, matching metadata contradictions, and white text hiding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-secondary/20 py-8 text-xs text-muted">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-semibold text-[10px]">
              HL
            </div>
            <span>© 2026 HireLens AI. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="http://localhost:8000/api/v1/docs" target="_blank" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              API Documentation
            </a>
            <a href="https://github.com" target="_blank" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg> GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg> LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
