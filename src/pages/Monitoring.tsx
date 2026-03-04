import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getComplaintsWithBreach, computeSlaRemaining, updateComplaintStatus } from "@/lib/complaints";
import { Department, Complaint, ComplaintStatus } from "@/lib/types";

function urgencyColor(u: string) {
  if (u === "HIGH") return "bg-urgency-high text-primary-foreground";
  if (u === "MEDIUM") return "bg-urgency-medium text-primary-foreground";
  return "bg-urgency-low text-primary-foreground";
}

const Monitoring = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => getComplaintsWithBreach());
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEscalatedOnly, setShowEscalatedOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = complaints;
    if (deptFilter !== "all") result = result.filter((c) => c.department === deptFilter);
    if (urgencyFilter !== "all") result = result.filter((c) => c.urgency === urgencyFilter);
    if (showEscalatedOnly) result = result.filter((c) => c.escalated);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.text.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [complaints, deptFilter, urgencyFilter, searchQuery, showEscalatedOnly]);

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateComplaintStatus(id, status);
    setComplaints(getComplaintsWithBreach());
  };

  const breachedCount = filtered.filter((c) => computeSlaRemaining(c) < 0 && c.status !== "Resolved").length;

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">CivicGuard AI</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
          </Button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Complaint Monitoring</h1>
            <p className="text-muted-foreground mt-1">
              {filtered.length} complaints · {breachedCount} SLA breaches
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-border/50 bg-card/80 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search complaints, locations, IDs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-secondary/50 pl-10"
                  />
                </div>
              </div>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-[160px] bg-secondary/50">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Depts</SelectItem>
                  <SelectItem value="Roads">Roads</SelectItem>
                  <SelectItem value="Drainage">Drainage</SelectItem>
                  <SelectItem value="Electricity">Electricity</SelectItem>
                </SelectContent>
              </Select>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-[140px] bg-secondary/50">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={showEscalatedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowEscalatedOnly(!showEscalatedOnly)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Escalated Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border/50 bg-card/80">
          <CardContent className="pt-6">
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Dept</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
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
                        <TableCell className="max-w-[220px] truncate">{c.text}</TableCell>
                        <TableCell>{c.department}</TableCell>
                        <TableCell>{c.location}</TableCell>
                        <TableCell>
                          <Badge className={urgencyColor(c.urgency)}>{c.urgency}</Badge>
                        </TableCell>
                        <TableCell>{c.status}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(c.submittedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {c.status === "Resolved" ? (
                            <span className="text-urgency-low font-medium">Done</span>
                          ) : breached ? (
                            <span className="font-semibold text-destructive">Breached</span>
                          ) : (
                            <span>{remaining}d left</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {c.escalated ? (
                            <Badge variant="destructive">Yes</Badge>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
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
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                        No complaints match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Monitoring;
