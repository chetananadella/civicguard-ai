import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Send, ArrowLeft, FileText, MapPin, Building2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { classifyUrgency } from "@/lib/nlp";
import { addComplaint } from "@/lib/complaints";
import { Department, Complaint } from "@/lib/types";

function urgencyColor(u: string) {
  if (u === "HIGH") return "bg-urgency-high text-primary-foreground";
  if (u === "MEDIUM") return "bg-urgency-medium text-primary-foreground";
  return "bg-urgency-low text-primary-foreground";
}

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [department, setDepartment] = useState<Department | "">("");
  const [location, setLocation] = useState("");
  const [preview, setPreview] = useState<{ urgency: string; slaDays: number } | null>(null);

  // Live preview of urgency as user types
  const handleTextChange = (val: string) => {
    setText(val);
    if (val.trim().length > 10) {
      setPreview(classifyUrgency(val));
    } else {
      setPreview(null);
    }
  };

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
    toast({
      title: "✅ Complaint Submitted Successfully",
      description: `Urgency: ${urgency} — SLA: ${slaDays} days. Your complaint ID is ${complaint.id}`,
    });
    navigate("/citizen");
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">CivicGuard AI</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/citizen" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
          </Button>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-2 text-3xl font-bold">Submit a Complaint</h1>
        <p className="mb-8 text-muted-foreground">Describe your civic issue and our AI will classify its urgency automatically.</p>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <Card className="border-border/50 bg-card/80">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> Complaint Description
                  </Label>
                  <Textarea
                    placeholder="Describe the civic issue in detail. Include specifics like what happened, how severe it is, and any safety concerns..."
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="min-h-[160px] bg-secondary/50"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" /> Department
                    </Label>
                    <Select value={department} onValueChange={(v) => setDepartment(v as Department)}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Roads">🛣️ Roads</SelectItem>
                        <SelectItem value="Drainage">🚰 Drainage</SelectItem>
                        <SelectItem value="Electricity">⚡ Electricity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> Location
                    </Label>
                    <Input
                      placeholder="e.g., MG Road, Sector 12"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-secondary/50"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2 h-12 text-base">
                  <Send className="h-5 w-5" /> Submit Complaint
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* AI Preview Panel */}
          <div className="space-y-4">
            <Card className="border-border/50 bg-card/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  AI Classification Preview
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time urgency analysis as you type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {preview ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Urgency</span>
                      <Badge className={urgencyColor(preview.urgency)}>{preview.urgency}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">SLA Deadline</span>
                      <span className="font-semibold">{preview.slaDays} days</span>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 mt-2">
                      <p className="text-xs text-muted-foreground">
                        {preview.urgency === "HIGH"
                          ? "⚠️ Emergency keywords detected. This will be prioritized for immediate attention."
                          : preview.urgency === "MEDIUM"
                          ? "🔧 Infrastructure issue detected. Standard priority processing."
                          : "📋 General request. Will be handled within standard timeline."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Start typing your complaint to see AI classification...
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">SLA Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-urgency-high" /> HIGH
                  </span>
                  <span className="text-muted-foreground">3 days (fire, flood, accident)</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-urgency-medium" /> MEDIUM
                  </span>
                  <span className="text-muted-foreground">7 days (broken, leak, damage)</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-urgency-low" /> LOW
                  </span>
                  <span className="text-muted-foreground">14 days (general requests)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitComplaint;
