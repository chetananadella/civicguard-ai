import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Shield, Plus, ArrowLeft, PieChart as PieIcon, FileText, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getComplaintsWithBreach, computeSlaRemaining } from "@/lib/complaints";
import { Complaint } from "@/lib/types";

function urgencyColor(u: string) {
  if (u === "HIGH") return "bg-urgency-high text-primary-foreground";
  if (u === "MEDIUM") return "bg-urgency-medium text-primary-foreground";
  return "bg-urgency-low text-primary-foreground";
}

const PIE_COLORS = ["hsl(0,72%,56%)", "hsl(32,95%,52%)", "hsl(142,71%,50%)"];

const Citizen = () => {
  const [complaints] = useState<Complaint[]>(() => getComplaintsWithBreach());

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "Pending").length;
    const resolved = complaints.filter((c) => c.status === "Resolved").length;
    const breached = complaints.filter((c) => computeSlaRemaining(c) < 0 && c.status !== "Resolved").length;
    return { total, pending, resolved, breached };
  }, [complaints]);

  const urgencyData = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    complaints.forEach((c) => counts[c.urgency]++);
    return [
      { name: "High", value: counts.HIGH },
      { name: "Medium", value: counts.MEDIUM },
      { name: "Low", value: counts.LOW },
    ];
  }, [complaints]);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">CivicGuard AI</span>
          </Link>
          <div className="flex gap-2">
            <Button size="sm" asChild className="gap-2">
              <Link to="/submit">
                <Plus className="h-4 w-4" /> New Complaint
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-8 text-3xl font-bold">Citizen Dashboard</h1>

        {/* KPI Row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-card/80">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3"><FileText className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Filed</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-urgency-medium/10 p-3"><Clock className="h-5 w-5 text-urgency-medium" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-urgency-low/10 p-3"><PieIcon className="h-5 w-5 text-urgency-low" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold">{stats.resolved}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-destructive/10 p-3"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
              <div>
                <p className="text-sm text-muted-foreground">SLA Breached</p>
                <p className="text-3xl font-bold">{stats.breached}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Urgency Pie */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader><CardTitle className="text-lg">Urgency Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={urgencyData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {urgencyData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222,47%,9%)", border: "1px solid hsl(217,33%,17%)", borderRadius: "8px" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Complaints Table */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">My Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Dept</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>SLA Remaining</TableHead>
                      <TableHead>Escalated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map((c) => {
                      const remaining = computeSlaRemaining(c);
                      const breached = remaining < 0 && c.status !== "Resolved";
                      return (
                        <TableRow key={c.id} className={breached ? "bg-destructive/10" : ""}>
                          <TableCell className="max-w-[200px] truncate">{c.text}</TableCell>
                          <TableCell>{c.department}</TableCell>
                          <TableCell>
                            <Badge className={urgencyColor(c.urgency)}>{c.urgency}</Badge>
                          </TableCell>
                          <TableCell>{c.status}</TableCell>
                          <TableCell>
                            {c.status === "Resolved" ? (
                              <span className="text-urgency-low">Done</span>
                            ) : breached ? (
                              <span className="font-semibold text-destructive">Breached</span>
                            ) : (
                              `${remaining} days`
                            )}
                          </TableCell>
                          <TableCell>
                            {c.escalated ? (
                              <Badge variant="destructive">Yes</Badge>
                            ) : (
                              <span className="text-muted-foreground">No</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Citizen;
