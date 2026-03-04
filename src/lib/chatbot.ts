interface ChatResponse {
  text: string;
}

const RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ["report", "submit", "complaint", "file", "how to"],
    response:
      "To report a complaint, go to the **Submit Complaint** page. Fill in the description, select a department (Roads, Drainage, or Electricity), enter the location, and click Submit. Our AI will automatically classify the urgency and assign an SLA deadline.",
  },
  {
    keywords: ["status", "track", "check", "where", "update"],
    response:
      "You can view all your complaint statuses on the **Citizen Dashboard**. Each complaint shows its current status (Pending, In Progress, or Resolved), urgency level, and SLA remaining days.",
  },
  {
    keywords: ["drainage", "water", "sewer", "flood", "drain"],
    response:
      "Drainage-related issues are handled by the **Drainage Department**. This includes flooding, water stagnation, blocked drains, and sewer problems. Report these through the Submit Complaint page and select 'Drainage' as the department.",
  },
  {
    keywords: ["road", "pothole", "traffic", "highway"],
    response:
      "Road-related complaints including potholes, damaged surfaces, missing signage, and traffic issues are managed by the **Roads Department**. SLA varies from 3–14 days based on urgency.",
  },
  {
    keywords: ["electric", "power", "light", "wire", "outage"],
    response:
      "Electrical complaints like power outages, faulty wiring, broken streetlights, and transformer issues go to the **Electricity Department**. High-risk electrical issues are flagged as HIGH urgency with a 3-day SLA.",
  },
  {
    keywords: ["sla", "time", "days", "how long", "deadline", "resolution"],
    response:
      "Resolution time depends on urgency:\n\n• **HIGH** (fire, flood, accidents): **3 days**\n• **MEDIUM** (broken, leak, damage): **7 days**\n• **LOW** (general requests): **14 days**\n\nIf the SLA is breached, the complaint is automatically escalated.",
  },
  {
    keywords: ["escalat", "breach", "overdue", "late"],
    response:
      "When a complaint exceeds its SLA deadline without being resolved, it is **automatically escalated**. Escalated complaints are flagged in the admin dashboard and given higher priority for immediate attention.",
  },
  {
    keywords: ["admin", "dashboard", "analytics"],
    response:
      "The **Admin Dashboard** provides a complete overview with KPI cards (total complaints, high priority count, SLA violations, department performance), charts for urgency distribution and status breakdown, and full complaint management capabilities.",
  },
  {
    keywords: ["hello", "hi", "hey", "help", "assist"],
    response:
      "Hello! 👋 I'm the **CivicGuard AI Assistant**. I can help you with:\n\n• How to report complaints\n• Checking complaint status\n• Understanding departments\n• SLA and escalation info\n• General platform guidance\n\nWhat would you like to know?",
  },
  {
    keywords: ["department", "which", "who handles"],
    response:
      "CivicGuard AI covers three departments:\n\n🛣️ **Roads** — Potholes, road damage, traffic signs\n🚰 **Drainage** — Floods, blocked drains, sewage\n⚡ **Electricity** — Power outages, faulty wiring, streetlights\n\nSelect the appropriate department when submitting a complaint.",
  },
];

const FALLBACK =
  "I'm not sure I understand that question. I can help you with reporting complaints, checking status, understanding SLA deadlines, department information, and escalation policies. Could you rephrase your question?";

export function getChatbotResponse(message: string): ChatResponse {
  const lower = message.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some((kw) => lower.includes(kw))) {
      return { text: r.response };
    }
  }
  return { text: FALLBACK };
}
