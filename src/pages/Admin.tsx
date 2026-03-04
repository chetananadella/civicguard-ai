import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft, AlertTriangle, BarChart3, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getComplaintsWithBreach, getDashboardMetrics, computeSlaRemaining, updateComplaintStatus } from "@/lib/complaints";
import { Department, Complaint, ComplaintStatus } from "@/lib/types";

function urgencyColor(u: string) {
  if (u === "HIGH") return "bg-urgency-high text-white";
  if (u === "MEDIUM") return "bg-urgency-medium text-white";
  return "bg-urgency-low text-white";
}

const PIE_COLORS = ["hsl(0,72%,56%)", "hsl(32,95%,52%)", "hsl(142,71%,50%)"];
const BAR_COLORS = { Pending: "hsl(32,95%,52%)", "In Progress": "hsl(199,89%,48%)", Resolved: "hsl(142,71%,50%)" };

const Admin = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => getComplaintsWithBreach());
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const filtered = useMemo(
    () => (deptFilter === "all" ? complaints : complaints.filter((c) => c.department === deptFilter)),
    [complaints, deptFilter]
  );

  const metrics = useMemo(
    () => getDashboardMetrics(complaints, deptFilter === "all" ? undefined : (deptFilter as Department)),
    [complaints, deptFilter]
  );

  const urgencyData = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    filtered.forEach((c) => counts[c.urgency]++);
    return [
      { name: "High", value: counts.HIGH },
      { name: "Medium", value: counts.MEDIUM },
      { name: "Low", value: counts.LOW },
    ];
  }, [filtered]);

  const statusData = useMemo(() => {
    const counts = { Pending: 0, "In Progress": 0, Resolved: 0 };
    filtered.forEach((c) => counts[c.status]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateComplaintStatus(id, status);
    setComplaints(getComplaintsWithBreach());
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">CivicGuard AI</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/monitoring" className="gap-2">
                Monitoring
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[200px] bg-secondary/50">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Roads">Roads</SelectItem>
              <SelectItem value="Drainage">Drainage</SelectItem>
              <SelectItem value="Electricity">Electricity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-card/80">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Complaints</p>
                <p className="text-3xl font-bold">{metrics.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-3xl font-bold">{metrics.highPriority}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-urgency-medium/10 p-3">
                <BarChart3 className="h-6 w-6 text-urgency-medium" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">SLA Violation</p>
                <p className="text-3xl font-bold">{metrics.slaViolationPct}%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-urgency-low/10 p-3">
                <TrendingUp className="h-6 w-6 text-urgency-low" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dept Performance</p>
                <p className="text-3xl font-bold">{metrics.perfScore}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle>Urgency Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={urgencyData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
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
          <Card className="border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle>Complaint Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,17%)" />
                  <XAxis dataKey="name" stroke="hsl(215,20%,60%)" />
                  <YAxis stroke="hsl(215,20%,60%)" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222,47%,9%)", border: "1px solid hsl(217,33%,17%)", borderRadius: "8px" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={BAR_COLORS[entry.name as keyof typeof BAR_COLORS]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Complaints Table */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader>
            <CardTitle>All Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Dept</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Escalated</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => {
                    const remaining = computeSlaRemaining(c);
                    const breached = remaining < 0 && c.status !== "Resolved";
                    return (
                      <TableRow key={c.id} className={breached ? "bg-destructive/10" : ""}>
                        <TableCell className="font-mono text-xs">{c.id}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{c.text}</TableCell>
                        <TableCell>{c.department}</TableCell>
                        <TableCell>{c.location}</TableCell>
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
                            `${remaining}d`
                          )}
                        </TableCell>
                        <TableCell>
                          {c.escalated ? <Badge variant="destructive">Yes</Badge> : <span className="text-muted-foreground">No</span>}
                        </TableCell>
                        <TableCell>
                          {c.status !== "Resolved" && (
                            <Select
                              value={c.status}
                              onValueChange={(v) => handleStatusChange(c.id, v as ComplaintStatus)}
                            >
                              <SelectTrigger className="h-8 w-[130px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
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
      </main>
    </div>
  );
};

export default Admin;
