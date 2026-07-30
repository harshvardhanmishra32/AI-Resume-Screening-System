"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { 
  LogOut, 
  User, 
  FileText, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowUpRight,
  TrendingUp,
  AlertOctagon,
  Users,
  Sun,
  Moon,
  Loader2
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  roles: { name: string; description: string }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [jobs, setJobs] = useState([
    { id: 1, title: "Senior Frontend Engineer", department: "Engineering" },
    { id: 2, title: "AI/ML Research Scientist", department: "Research" },
    { id: 3, title: "DevOps Engineer", department: "Infrastructure" }
  ]);
  const [selectedJobId, setSelectedJobId] = useState(1);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDept, setNewJobDept] = useState("Engineering");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [atsReport, setAtsReport] = useState<{ score: number; matching: string[]; missing: string[]; tips: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadedFileName(file.name);
      setAtsReport(null);
      setTimeout(() => {
        setIsUploading(false);
        setAtsReport({
          score: Math.floor(Math.random() * 15) + 80,
          matching: ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "HTML5"],
          missing: ["GraphQL", "Docker", "AWS Deployments"],
          tips: [
            "Integrate quantitative metrics (e.g. 'boosted web page load speed by 35%').",
            "State your experience with server-side architecture explicitly in sections.",
            "Remove colored skill progress bars so parser bots read standard text layout."
          ]
        });
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          // Token expired or invalid
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          router.push("/login");
        }
      } catch (err) {
        setErrorMsg("Unable to communicate with the backend. Make sure the FastAPI backend is running on port 8000.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-muted font-medium">Loading workspace workspace...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="border border-destructive/20 bg-destructive/10 p-6 rounded-xl text-center space-y-4 max-w-sm">
          <ShieldAlert className="h-8 w-8 text-destructive mx-auto" />
          <h3 className="text-sm font-bold text-destructive">Connection Failure</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{errorMsg}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const userRole = profile?.roles?.[0]?.name || "RECRUITER";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      
      {/* Dashboard Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              HL
            </Link>
            <span className="font-semibold text-sm tracking-tight">HireLens AI <span className="text-muted font-normal">/ Dashboard</span></span>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Theme switcher */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Toggle Theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
            </button>

            {/* Profile pill */}
            <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 bg-card text-xs">
              <User className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold">{profile?.first_name} {profile?.last_name}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase">{userRole}</span>
            </div>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="h-8 px-3 border border-border hover:bg-secondary/40 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Workspace */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-10 space-y-8">
        
        {/* Intro banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome, {profile?.first_name}</h1>
            <p className="text-xs text-muted mt-1">Here is a summary of active candidate screen matches and analytics for your workspace.</p>
          </div>
          <button 
            onClick={() => setIsJobModalOpen(true)}
            className="text-xs font-semibold px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            + Create New Job Opening
          </button>
        </div>

        {/* Recruiter Dashboard View */}
        {userRole === "RECRUITER" ? (
          <>
            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border border-border bg-card p-5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-muted">
                  <span className="text-xs font-semibold">Total Screened Resumes</span>
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">148</span>
                  <span className="text-[10px] text-success font-semibold flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +12%</span>
                </div>
              </div>

              <div className="border border-border bg-card p-5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-muted">
                  <span className="text-xs font-semibold">Fraud Alerts Ingested</span>
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-destructive">2</span>
                  <span className="text-[10px] text-destructive bg-destructive/10 px-1.5 py-0.5 rounded font-semibold">Action Required</span>
                </div>
              </div>

              <div className="border border-border bg-card p-5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-muted">
                  <span className="text-xs font-semibold">Avg. Match Score</span>
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">78.4%</span>
                  <span className="text-[10px] text-muted font-medium">Standard threshold</span>
                </div>
              </div>

              <div className="border border-border bg-card p-5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-muted">
                  <span className="text-xs font-semibold">Unresolved Pipeline Positions</span>
                  <Users className="h-4 w-4 text-muted" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">6</span>
                  <span className="text-[10px] text-muted font-medium">Openings requiring action</span>
                </div>
              </div>
            </div>

            {/* Platform screen list */}
            <div className="border border-border bg-card rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-6">
                <div>
                  <h3 className="font-semibold text-sm">Resume Screening Pipeline</h3>
                  <p className="text-[10px] text-muted mt-0.5">Top-ranked applicants parsed using local sentence-transformers.</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-lg border border-border bg-secondary/35 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                  <div className="relative hidden sm:block">
                    <Search className="h-3.5 w-3.5 text-muted absolute left-3 top-2.5" />
                    <input 
                      type="text" 
                      placeholder="Search candidates..." 
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-border bg-secondary/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-48"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-muted border-b border-border pb-3">
                      <th className="py-2.5 font-medium">Applicant</th>
                      <th className="py-2.5 font-medium">Matched Score</th>
                      <th className="py-2.5 font-medium">Skills Extracted</th>
                      <th className="py-2.5 font-medium">Pipeline Placement</th>
                      <th className="py-2.5 font-medium">Fraud Screening</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-secondary/10 transition-colors">
                      <td className="py-4">
                        <span className="font-semibold block">Sarah Jenkins</span>
                        <span className="text-[10px] text-muted">sarah.j@gmail.com</span>
                      </td>
                      <td className="py-4">
                        <span className="text-success font-bold">94.8%</span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {["React 19", "Next.js", "TypeScript"].map((s, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 bg-secondary border border-border rounded font-medium">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium text-[10px]">Technical Assessment</span>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1.5 text-success font-medium"><CheckCircle2 className="h-3.5 w-3.5" /> Clear</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-secondary/10 transition-colors">
                      <td className="py-4">
                        <span className="font-semibold block">David Chen</span>
                        <span className="text-[10px] text-muted">d.chen@aiux.org</span>
                      </td>
                      <td className="py-4">
                        <span className="text-success font-bold">88.2%</span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {["Python", "PyTorch", "NLP"].map((s, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 bg-secondary border border-border rounded font-medium">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded bg-secondary text-foreground font-medium text-[10px]">Applied</span>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1.5 text-success font-medium"><CheckCircle2 className="h-3.5 w-3.5" /> Clear</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-secondary/10 transition-colors">
                      <td className="py-4">
                        <span className="font-semibold block">Alex Mercer</span>
                        <span className="text-[10px] text-muted">alexm@cloudops.net</span>
                      </td>
                      <td className="py-4">
                        <span className="text-warning font-bold">81.5%</span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {["AWS", "Kubernetes"].map((s, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 bg-secondary border border-border rounded font-medium">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded bg-secondary text-foreground font-medium text-[10px]">Applied</span>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1.5 text-destructive font-medium animate-pulse"><AlertOctagon className="h-3.5 w-3.5" /> White Text Found</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Candidate Dashboard View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 border border-border bg-card p-6 rounded-xl space-y-4">
              <h3 className="font-semibold text-sm pb-2 border-b border-border">My Profile</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted block">Full Name</span>
                  <span className="font-semibold text-sm">{profile?.first_name} {profile?.last_name}</span>
                </div>
                <div>
                  <span className="text-muted block">Email Address</span>
                  <span className="font-semibold">{profile?.email}</span>
                </div>
                <div>
                  <span className="text-muted block">Roles Assigned</span>
                  <span className="font-semibold text-primary">CANDIDATE</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 border border-border bg-card p-6 rounded-xl space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <h3 className="font-semibold text-sm">Upload & Score Report</h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase">
                  {isUploading ? "Analyzing..." : atsReport ? "Completed" : "Ready"}
                </span>
              </div>

              {/* Hidden file input */}
              <input 
                type="file" 
                id="resume-upload" 
                accept=".pdf,.docx" 
                className="hidden" 
                onChange={handleFileChange} 
              />

              {isUploading ? (
                /* Loading State */
                <div className="border border-border rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-4 bg-secondary/10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div>
                    <span className="text-xs font-semibold block">Analyzing {uploadedFileName}...</span>
                    <span className="text-[10px] text-muted block mt-1">Running NLP entity extraction and matching algorithm...</span>
                  </div>
                </div>
              ) : atsReport ? (
                /* Report View State */
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Summary row */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-border rounded-xl bg-secondary/15">
                    <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="34" className="stroke-border fill-transparent" strokeWidth="6" />
                        <circle cx="40" cy="40" r="34" className="stroke-success fill-transparent" strokeWidth="6" 
                          strokeDasharray={2 * Math.PI * 34} 
                          strokeDashoffset={2 * Math.PI * 34 * (1 - atsReport.score / 100)} 
                        />
                      </svg>
                      <span className="absolute text-base font-bold text-success">{atsReport.score}%</span>
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="text-xs font-bold block">{uploadedFileName}</span>
                      <span className="text-[10px] text-muted block">Extracted ATS Compatibility Rating</span>
                      <button 
                        onClick={() => document.getElementById("resume-upload")?.click()}
                        className="text-[10px] text-primary hover:underline font-semibold block pt-1.5"
                      >
                        Upload Another Version
                      </button>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-xs text-primary mb-3">Extracted Skills Match</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {atsReport.matching.map((s, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-success/10 border border-success/20 text-success rounded font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-xs text-warning mb-3">Identified Skill Gaps</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {atsReport.missing.map((s, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-warning/10 border border-warning/20 text-warning rounded font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Improvement Checklist */}
                  <div className="pt-2">
                    <h4 className="font-semibold text-xs text-muted-foreground mb-3">ATS Compliance Checklist</h4>
                    <ul className="text-xs space-y-2.5 text-muted">
                      {atsReport.tips.map((t, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                /* Static drag box state */
                <div 
                  onClick={() => document.getElementById("resume-upload")?.click()}
                  className="border border-dashed border-border rounded-xl p-8 text-center bg-secondary/10 hover:bg-secondary/20 transition-all cursor-pointer"
                >
                  <FileText className="h-10 w-10 text-primary mx-auto mb-3" />
                  <span className="text-xs font-semibold block">Click to upload your resume file</span>
                  <span className="text-[10px] text-muted block mt-1">Accepts PDF or DOCX up to 5MB</span>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Create Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl w-full max-w-[420px] p-6 shadow-lg space-y-4">
            <div>
              <h3 className="font-bold text-sm">Create New Job Opening</h3>
              <p className="text-[10px] text-muted mt-1">Add details for the new open position pipeline.</p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (newJobTitle.trim()) {
                const newId = jobs.length + 1;
                setJobs([...jobs, { id: newId, title: newJobTitle, department: newJobDept }]);
                setSelectedJobId(newId);
                setNewJobTitle("");
                setIsJobModalOpen(false);
              }
            }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted" htmlFor="jobTitle">Job Title</label>
                <input
                  id="jobTitle"
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Engineer"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/30 rounded-lg border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted" htmlFor="jobDept">Department</label>
                <select
                  id="jobDept"
                  value={newJobDept}
                  onChange={(e) => setNewJobDept(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/30 rounded-lg border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Research">Research / AI</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Product">Product Management</option>
                  <option value="Design">Design / UX</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-3.5 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-95 transition-all cursor-pointer"
                >
                  Create Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
