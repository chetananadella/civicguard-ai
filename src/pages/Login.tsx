import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { login, register, UserRole } from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("citizen");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      toast({ title: "Missing email", variant: "destructive" });
      return;
    }
    const user = login(loginEmail, loginPassword);
    if (user) {
      toast({ title: `Welcome back, ${user.name}!` });
      navigate(user.role === "admin" ? "/admin" : "/citizen");
    } else {
      // Auto-register as citizen for demo
      const newUser = register(loginEmail.split("@")[0], loginEmail, "citizen");
      toast({ title: `Account created! Welcome, ${newUser.name}` });
      navigate("/citizen");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }
    const user = register(regName, regEmail, regRole);
    toast({ title: `Registered as ${regRole}! Welcome, ${user.name}` });
    navigate(regRole === "admin" ? "/admin" : "/citizen");
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Shield className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold tracking-tight">CivicGuard AI</span>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome</CardTitle>
            <CardDescription>Sign in or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="rahul@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-secondary/50"
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <LogIn className="h-4 w-4" /> Sign In
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Demo: admin@civicguard.gov (admin) · rahul@example.com (citizen)
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      placeholder="Your name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={regRole} onValueChange={(v) => setRegRole(v as UserRole)}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <UserPlus className="h-4 w-4" /> Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
