import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Send, Bot, User, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChatbotResponse } from "@/lib/chatbot";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
}

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  text: "Hello! 👋 I'm the **CivicGuard AI Assistant**. I can help you with:\n\n• How to report complaints\n• Checking complaint status\n• Understanding departments & SLA\n• Escalation policies\n\nHow can I assist you today?",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const QUICK_QUESTIONS = [
  "How do I report a complaint?",
  "What departments are available?",
  "How long does resolution take?",
  "What happens when SLA is breached?",
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `m${Date.now()}`,
      role: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getChatbotResponse(text);
      const botMsg: Message = {
        id: `m${Date.now() + 1}`,
        role: "bot",
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering for bold and bullet points
    return text.split("\n").map((line, i) => {
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const isBullet = processed.startsWith("•");
      if (isBullet) {
        return (
          <p key={i} className="ml-2 my-0.5" dangerouslySetInnerHTML={{ __html: processed }} />
        );
      }
      return (
        <p key={i} className={line === "" ? "h-2" : "my-0.5"} dangerouslySetInnerHTML={{ __html: processed }} />
      );
    });
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <nav className="border-b border-border/50 shrink-0">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">CivicGuard AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Assistant</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Chat area */}
      <div className="flex-1 mx-auto w-full max-w-4xl flex flex-col px-6 py-4 min-h-0">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary/80 text-foreground rounded-bl-md"
                  }`}
                >
                  <div>{renderMarkdown(msg.text)}</div>
                  <p className={`text-[10px] mt-2 ${msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {msg.time}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="shrink-0 h-8 w-8 rounded-full bg-chart-5/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-chart-5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-secondary/80 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick questions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 py-3">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3 pt-3 border-t border-border/50 shrink-0">
          <Input
            placeholder="Ask me anything about civic services..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-secondary/50 rounded-full"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
