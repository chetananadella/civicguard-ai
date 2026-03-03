

# CivicGuard AI – Digital Civic Problem Auto-Escalation System

## Overview
A polished, hackathon-ready civic complaint management system with AI-based urgency classification, SLA monitoring, and auto-escalation — built as a frontend-only app with mock data and Tailwind dark theme.

## Pages & Navigation

### 1. Landing Page (`/`)
- Hero section with gradient background, product name "CivicGuard AI" and tagline
- Feature highlights (AI Classification, SLA Monitoring, Auto-Escalation) as icon cards
- Two prominent CTA buttons: **"I'm a Citizen"** → `/citizen`, **"I'm an Admin"** → `/admin`
- Professional dark theme throughout

### 2. Citizen Panel (`/citizen`)
- **Complaint Submission Form**: text area, department dropdown (Roads, Drainage, Electricity), location input
- On submit: keyword-based NLP runs client-side to classify urgency:
  - HIGH (3-day SLA) → keywords: accident, danger, fire, flood
  - MEDIUM (7-day SLA) → keywords: broken, leak, damage
  - LOW (14-day SLA) → default
- Complaint stored in React state (persisted to localStorage)
- **My Complaints Table**: shows status, urgency badge (red/orange/green), SLA remaining days, escalation status

### 3. Admin Dashboard (`/admin`)
- **KPI Cards**: Total Complaints, High Priority Count, SLA Violation %, Department Performance Score (100 - 5 × breached)
- **Charts** (using Recharts): Urgency distribution pie chart, Complaint status bar chart
- **Department filter** dropdown
- **Complaints Table**: all complaints with SLA breach auto-detection (current date > submitted + SLA days → "Breached" + Escalated), breached rows highlighted in red
- Ability to update complaint status (Pending → In Progress → Resolved)

## Design
- Dark modern SaaS theme using Tailwind's dark mode
- Card-based layout with subtle borders and shadows
- Clean typography, colored urgency badges, professional spacing
- Fully responsive

## Data & Logic
- All data stored in localStorage with seed/mock data pre-loaded
- NLP classification logic as a utility function
- SLA breach calculation runs on render
- ~15 pre-seeded complaints across departments and urgency levels for demo

