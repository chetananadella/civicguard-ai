import { Complaint, Department } from "./types";
import { differenceInDays } from "date-fns";

const STORAGE_KEY = "civicguard_complaints";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const SEED_DATA: Complaint[] = [
  { id: "c1", text: "Major fire hazard near transformer on MG Road", department: "Electricity", location: "MG Road", urgency: "HIGH", slaDays: 3, submittedAt: daysAgo(5), status: "Pending", escalated: false },
  { id: "c2", text: "Flood water accumulating in Sector 12 underpass", department: "Drainage", location: "Sector 12", urgency: "HIGH", slaDays: 3, submittedAt: daysAgo(4), status: "In Progress", escalated: false },
  { id: "c3", text: "Dangerous open manhole on NH-48", department: "Roads", location: "NH-48", urgency: "HIGH", slaDays: 3, submittedAt: daysAgo(6), status: "Pending", escalated: false },
  { id: "c4", text: "Broken streetlight causing accidents at night", department: "Electricity", location: "Park Avenue", urgency: "MEDIUM", slaDays: 7, submittedAt: daysAgo(10), status: "Pending", escalated: false },
  { id: "c5", text: "Water leak from main pipeline on 5th Street", department: "Drainage", location: "5th Street", urgency: "MEDIUM", slaDays: 7, submittedAt: daysAgo(8), status: "In Progress", escalated: false },
  { id: "c6", text: "Road surface damage near city hospital entrance", department: "Roads", location: "Hospital Road", urgency: "MEDIUM", slaDays: 7, submittedAt: daysAgo(9), status: "Pending", escalated: false },
  { id: "c7", text: "Cracked sidewalk near Central Park", department: "Roads", location: "Central Park", urgency: "MEDIUM", slaDays: 7, submittedAt: daysAgo(3), status: "Resolved", escalated: false },
  { id: "c8", text: "Pothole on Ring Road causing traffic issues", department: "Roads", location: "Ring Road", urgency: "MEDIUM", slaDays: 7, submittedAt: daysAgo(12), status: "Pending", escalated: false },
  { id: "c9", text: "Streetlight flickering on Main Boulevard", department: "Electricity", location: "Main Boulevard", urgency: "LOW", slaDays: 14, submittedAt: daysAgo(2), status: "Pending", escalated: false },
  { id: "c10", text: "Request to install new drainage cover", department: "Drainage", location: "Green Colony", urgency: "LOW", slaDays: 14, submittedAt: daysAgo(5), status: "In Progress", escalated: false },
  { id: "c11", text: "Speed breaker paint faded on School Road", department: "Roads", location: "School Road", urgency: "LOW", slaDays: 14, submittedAt: daysAgo(7), status: "Resolved", escalated: false },
  { id: "c12", text: "Power outage danger in the industrial zone", department: "Electricity", location: "Industrial Zone", urgency: "HIGH", slaDays: 3, submittedAt: daysAgo(2), status: "In Progress", escalated: false },
  { id: "c13", text: "Blocked drainage causing water stagnation", department: "Drainage", location: "Lake View Colony", urgency: "MEDIUM", slaDays: 7, submittedAt: daysAgo(11), status: "Pending", escalated: false },
  { id: "c14", text: "New road marking requested for junction", department: "Roads", location: "City Junction", urgency: "LOW", slaDays: 14, submittedAt: daysAgo(1), status: "Pending", escalated: false },
  { id: "c15", text: "Faulty wiring exposed on electric pole", department: "Electricity", location: "Elm Street", urgency: "MEDIUM", slaDays: 7, submittedAt: daysAgo(14), status: "Pending", escalated: false },
];

export function getComplaints(): Complaint[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(stored);
}

export function saveComplaints(complaints: Complaint[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export function addComplaint(complaint: Complaint) {
  const all = getComplaints();
  all.unshift(complaint);
  saveComplaints(all);
}

export function updateComplaintStatus(id: string, status: Complaint["status"]) {
  const all = getComplaints();
  const idx = all.findIndex((c) => c.id === id);
  if (idx !== -1) {
    all[idx].status = status;
    saveComplaints(all);
  }
}

export function computeSlaRemaining(complaint: Complaint): number {
  const submitted = new Date(complaint.submittedAt);
  const deadline = new Date(submitted);
  deadline.setDate(deadline.getDate() + complaint.slaDays);
  return differenceInDays(deadline, new Date());
}

export function isBreached(complaint: Complaint): boolean {
  return computeSlaRemaining(complaint) < 0 && complaint.status !== "Resolved";
}

export function getComplaintsWithBreach(): Complaint[] {
  return getComplaints().map((c) => ({
    ...c,
    escalated: isBreached(c) ? true : c.escalated,
  }));
}

export function getDashboardMetrics(complaints: Complaint[], department?: Department) {
  const filtered = department ? complaints.filter((c) => c.department === department) : complaints;
  const total = filtered.length;
  const highPriority = filtered.filter((c) => c.urgency === "HIGH").length;
  const breached = filtered.filter((c) => isBreached(c)).length;
  const slaViolationPct = total > 0 ? Math.round((breached / total) * 100) : 0;
  const perfScore = Math.max(0, 100 - 5 * breached);

  return { total, highPriority, slaViolationPct, perfScore, breached };
}
