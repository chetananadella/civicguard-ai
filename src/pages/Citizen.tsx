import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { classifyUrgency } from "@/lib/nlp";
import { addComplaint, getComplaintsWithBreach, computeSlaRemaining } from "@/lib/complaints";
import { Department, Complaint } from "@/lib/types";

function urgencyColor(u: string) {
  if (u === "HIGH") return "bg-urgency-high text-white";
  if (u === "MEDIUM") return "bg-urgency-medium text-white";
  return "bg-urgency-low text-white";
}

const Citizen = () => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [department, setDepartment] = useState<Department | "">("");
  const [location, setLocation] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>(() => getComplaintsWithBreach());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !department || !location) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    const { urgency, slaDays } = classifyUrgency(text);
    const complaint: Complaint = {
      id: `c${Date.now()}`,
      text,
      department: department as Department,
      location,
      urgency,
      slaDays,
      submittedAt: new Date().toISOString(),
      status: "Pending",
      escalated: false,
    };
    addComplaint(complaint);
    setComplaints(getComplaintsWithBreach());
    setText("");
    setDepartment("");
    setLocation("");
    toast({ title: "Complaint Submitted", description: `Urgency: ${urgency} — SLA: ${slaDays} days` });
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">CivicGuard AI</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </Button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-8 text-3xl font-bold">Citizen Portal</h1>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Form */}
          <Card className="border-border/50 bg-card/80 h-fit">
            <CardHeader>
              <CardTitle className="text-xl">Submit a Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Complaint Description</Label>
                  <Textarea
                    placeholder="Describe the issue in detail..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[120px] bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={department} onValueChange={(v) => setDepartment(v as Department)}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Roads">Roads</SelectItem>
                      <SelectItem value="Drainage">Drainage</SelectItem>
                      <SelectItem value="Electricity">Electricity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="e.g., MG Road, Sector 12"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" /> Submit Complaint
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="text-xl">My Complaints</CardTitle>
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
