import { Link } from "react-router-dom";
import { Shield, Brain, Clock, ArrowUpRight, Users, Building2 } from "lucide-react";
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
    title: "SLA Monitoring",
    desc: "Real-time tracking of service level agreements with automatic breach detection and remaining time display.",
  },
  {
    icon: ArrowUpRight,
    title: "Auto-Escalation",
    desc: "Unresolved complaints are automatically escalated when SLA deadlines are breached — no manual oversight needed.",
  },
];

const Index = () => {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">CivicGuard AI</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/citizen">Citizen Portal</Link>
            </Button>
            <Button asChild>
              <Link to="/admin">Admin Dashboard</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-chart-5/5" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center lg:py-36">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
            <Shield className="h-4 w-4" />
            AI-Powered Civic Governance
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Transform Civic Complaints into{" "}
            <span className="bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent">
              Accountable Action
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            CivicGuard AI automates urgency classification, monitors SLA compliance, and escalates unresolved
            issues — ensuring no civic complaint falls through the cracks.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2 px-8 text-base">
              <Link to="/citizen">
                <Users className="h-5 w-5" />
                I'm a Citizen
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 px-8 text-base">
              <Link to="/admin">
                <Building2 className="h-5 w-5" />
                I'm an Admin
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
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
