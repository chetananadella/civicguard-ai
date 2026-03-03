import { Urgency } from "./types";

const HIGH_KEYWORDS = ["accident", "danger", "fire", "flood", "emergency", "collapse", "electrocution"];
const MEDIUM_KEYWORDS = ["broken", "leak", "damage", "crack", "pothole", "faulty", "blocked"];

export function classifyUrgency(text: string): { urgency: Urgency; slaDays: number } {
  const lower = text.toLowerCase();

  if (HIGH_KEYWORDS.some((kw) => lower.includes(kw))) {
    return { urgency: "HIGH", slaDays: 3 };
  }
  if (MEDIUM_KEYWORDS.some((kw) => lower.includes(kw))) {
    return { urgency: "MEDIUM", slaDays: 7 };
  }
  return { urgency: "LOW", slaDays: 14 };
}
