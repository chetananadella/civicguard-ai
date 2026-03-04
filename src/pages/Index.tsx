import { Link } from "react-router-dom";
import { Shield, Brain, Clock, ArrowUpRight, Users, Building2, MessageSquare, FileSearch, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI Urgency Classification",
    desc: "Keyword-based NLP instantly classifies complaints as High, Medium, or Low urgency with automatic SLA assignment.",
  },
  {
    icon: Clock,
    title: "SLA Monitoring & Breach Detection",
    desc: "Real-time tracking of service level agreements with automatic breach detection, escalation, and countdown display.",
  },
  {
    icon: ArrowUpRight,
    title: "Auto-Escalation Engine",
    desc: "Unresolved complaints are automatically escalated when SLA deadlines are breached — no manual oversight needed.",
  },
  {
    icon: MessageSquare,
    title: "AI Civic Assistant",
    desc: "Built-in chatbot answers questions about departments, SLA policies, complaint procedures, and resolution timelines.",
  },
  {
    icon: FileSearch,
    title: "Advanced Analytics Dashboard",
    desc: "KPI cards, urgency distribution charts, complaint status visualization, and department performance scoring.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    desc: "Citizens submit and track complaints while admins manage, filter, and resolve issues through a dedicated dashboard.",
  },
];

const stats = [
  { label: "Complaints Processed", value: "10,000+" },
  { label: "Avg Resolution Time", value: "4.2 days" },
  { label: "SLA Compliance", value: "94%" },
  { label: "Departments", value: "3" },
];

const Index = () => {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">CivicGuard AI</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/chatbot">AI Assistant</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/citizen">Dashboard</Link>
            </Button>
            <Button size="sm" asChild className="gap-2">
              <Link to="/login">
                <LogIn className="h-4 w-4" /> Sign In
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-chart-5/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.08)_0%,transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center lg:py-36">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
            <Shield className="h-4 w-4" />
            AI-Powered Civic Governance Platform
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Transform Civic Complaints into{" "}
            <span className="bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent">
              Accountable Action
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            CivicGuard AI automates urgency classification, monitors SLA compliance, provides an AI assistant,
            and escalates unresolved issues — ensuring no civic complaint falls through the cracks.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2 px-8 text-base h-12">
              <Link to="/citizen">
                <Users className="h-5 w-5" />
                I'm a Citizen
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 px-8 text-base h-12">
              <Link to="/admin">
                <Building2 className="h-5 w-5" />
                I'm an Admin
              </Link>
            </Button>
          </div>
          <div className="mt-6">
            <Button variant="link" asChild className="text-muted-foreground">
              <Link to="/chatbot" className="gap-2">
                <MessageSquare className="h-4 w-4" /> Try the AI Assistant →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need for intelligent civic complaint management, from AI classification to real-time analytics.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors group">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-gradient-to-b from-card/50 to-background">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join CivicGuard AI and help transform civic governance with AI-powered complaint management.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2 px-8">
              <Link to="/login">
                <LogIn className="h-5 w-5" /> Create Account
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 px-8">
              <Link to="/chatbot">
                <MessageSquare className="h-5 w-5" /> Talk to AI Assistant
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 CivicGuard AI — Built for smarter civic governance</p>
      </footer>
    </div>
  );
};

export default Index;
