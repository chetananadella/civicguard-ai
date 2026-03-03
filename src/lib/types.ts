export type Urgency = "HIGH" | "MEDIUM" | "LOW";
export type Department = "Roads" | "Drainage" | "Electricity";
export type ComplaintStatus = "Pending" | "In Progress" | "Resolved";

export interface Complaint {
  id: string;
  text: string;
  department: Department;
  location: string;
  urgency: Urgency;
  slaDays: number;
  submittedAt: string; // ISO date string
  status: ComplaintStatus;
  escalated: boolean;
}
