<div align="center">

# 🎟️ VaakTicket AI
### *AI-Powered Multilingual Campus Complaint Triage & Routing System*


> **Theme**: AI for Campus Operations × AI for Indian Multilingual Users
> **Hackathon**: AI For Impact 2025 — Acropolis Institute of Technology and Research, Indore

</div>

---

## 🧩 Problem Statement

Campus students — especially in Indian colleges — face a broken grievance system. Complaints get lost in WhatsApp groups, physical registers, or informal verbal escalations. There's no structured way to submit, track, or prioritize issues, especially for students who are more comfortable expressing themselves in **Hindi or Hinglish** than formal English.

> *"hostel floor 3 washroom me paani tapak raha hai teen din se"* — a real complaint that would never make it into a formal system.

**The result**: Maintenance teams remain unaware of critical issues. Students feel ignored. Admin has no data to act on.

---

## 💡 Our Solution

**VaakTicket AI** is a full-stack MERN application that lets students file campus complaints in **any language** — Hindi, English, or casual Hinglish — and automatically:

- Detects the language and intent using **Google Gemini AI**
- Extracts structured metadata (department, location, urgency, duration)
- Translates the input into a formal English complaint
- Generates a **trackable ticket ID** with an urgency score (0–100)
- Notifies the right department instantly
- Accepts complaints directly via **WhatsApp** (Twilio Webhook)
- Gives admins a **real-time analytics dashboard** to monitor and resolve issues

### ✅ Meets All 3 Judging Criteria

| Criterion | How VaakTicket Satisfies It |
|---|---|
| **Specific User Persona** | College student filing a complaint in Hinglish on their phone |
| **Multi-Step Workflow** | Input → Language Detection → AI Extraction → Urgency Scoring → Ticket Generation → Department Routing → Admin Dashboard |
| **Useful Output** | Structured ticket with ID, urgency score, formal complaint, department assignment, and WhatsApp confirmation |

---

## 🚀 Key Features

### 🗣️ Multilingual Input Support
Students write exactly how they speak — pure Hindi, English, or conversational Hinglish. The system handles all of it without any language toggle or pre-selection.

### 🧠 Gemini AI Processing Pipeline
A single raw complaint input is processed through a structured AI pipeline that extracts:
- **Language detection** (Hindi / English / Hinglish / Other)
- **Issue classification** (Plumbing, Electrical, IT, Mess, Hostel, Library, etc.)
- **Department mapping** (routes to the correct team automatically)
- **Location & duration** extraction from natural text
- **Urgency scoring** (0–100 based on safety risk + duration)
- **Formal English translation** (professional 2–3 sentence complaint)

### 📱 WhatsApp Webhook (Twilio)
Students can file complaints directly from WhatsApp by messaging the campus helpdesk number. They receive an instant reply:
> *"Your complaint has been registered. Ticket ID: TK-2026-XXXXX, Urgency: 82/100"*

### 📊 Admin Dashboard
- Live stats: Total / Pending / Resolved / High Priority
- Department-wise bar charts (Recharts)
- Interactive ticket table with expandable detail rows
- One-click status update (Pending → In Progress → Resolved)

### 🛡️ Robust Fallback Architecture
If Gemini API fails, a local regex-based `detectIssueType()` engine extracts basic categories from the input and issues a safe default ticket — ensuring **zero downtime** for students.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), Tailwind CSS v4, Lucide Icons, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **AI Model** | Google Gemini (`gemini-2.0-flash`) with JSON-mode prompting |
| **Messaging** | Twilio API — WhatsApp Sandbox Webhook |
| **Dev Tools** | Vite, dotenv, nodemon, ngrok (for webhook tunneling) |

---

## 📂 Project Structure

```
AI-FOR-IMPACT/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # StatCard, TicketTable, ResultCard, ProcessingSteps, Chart
│   │   ├── pages/              # SubmitPage (Student View) & AdminPage (Admin Dashboard)
│   │   ├── services/           # Axios API client (api.js)
│   │   ├── App.jsx             # Routing & Layout
│   │   ├── index.css           # Tailwind theme + custom CSS animations
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Express Backend
│   ├── Complaint.js            # Mongoose schema
│   ├── db.js                   # MongoDB Atlas connection
│   ├── gemini.js               # Gemini AI extraction pipeline & prompts
│   ├── index.js                # REST API endpoints + Twilio webhook handler
│   ├── seed.js                 # Database seeder (mock tickets for dashboard)
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Google Gemini API Key — [get one here](https://ai.google.dev)
- Twilio Account — optional, only needed for WhatsApp webhook

---

### 1. Clone the Repository

```bash
git clone https://github.com/suryakantc/AI-FOR-IMPACT.git
cd AI-FOR-IMPACT
```

### 2. Configure the Server

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.hdu2hwl.mongodb.net/campusflow?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here

# Optional — Twilio WhatsApp
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

Install dependencies and seed the database:

```bash
cd server
npm install
npm run seed       # Populates MongoDB with mock tickets for the admin dashboard
npm run dev        # Starts server at http://localhost:5000
```

### 3. Configure the Client

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Install and run:

```bash
cd ../client
npm install
npm run dev        # Frontend runs at http://localhost:5173
```

---

## 📱 WhatsApp Webhook Setup (Twilio)

1. Sign up at [twilio.com](https://twilio.com) and open the **WhatsApp Sandbox**
2. Start ngrok to expose your local server:
   ```bash
   ngrok http 5000
   ```
3. In Twilio Console, set the incoming message webhook to:
   ```
   https://<your-ngrok-id>.ngrok.io/api/whatsapp
   ```
   Method: **HTTP POST**
4. Send any Hinglish complaint to the sandbox number — you'll get a ticket confirmation reply instantly

---

## 🤖 How AI Was Used

VaakTicket AI uses **Google Gemini** as its core intelligence layer — not just as a chatbot, but as a structured data extraction engine embedded in a multi-step workflow.

### Prompt Engineering
The Gemini model is prompted with strict instructions to return **valid JSON only**, following a fixed schema:

```json
{
  "language": "Hindi-English" | "Hindi" | "English" | "Other",
  "issueType": "Electrical" | "Plumbing" | "Internet" | "Mess" | "Hostel" | "Academic" | "Library" | "Administrative" | "Other",
  "department": "string",
  "location": "string",
  "duration": "string",
  "urgency": 0–100,
  "summary": "under 20 words in English",
  "formalComplaint": "2–3 sentences in professional English"
}
```

### Fallback Strategy
1. **JSON Cleaning** — strips markdown backticks and preamble text from the response
2. **API Retry** — retries the Gemini call once on failure
3. **Local Fallback** — if both attempts fail, a regex-based `detectIssueType()` engine extracts basic categories from the student's raw input and issues a safe default ticket structure

This ensures the system **never fails silently** — a student always gets a ticket.

---

## 🏗️ Architecture Overview

```
Student (Browser / WhatsApp)
        │
        ▼
  React Frontend (Vite)
  SubmitPage → POST /api/complaints
        │
        ▼
  Express Server (Node.js)
        │
        ├──▶ gemini.js ──▶ Google Gemini API
        │         └──▶ Structured JSON extraction
        │                   (language, urgency, dept, etc.)
        │
        ├──▶ MongoDB Atlas (save ticket)
        │
        ├──▶ Twilio API (WhatsApp reply, if webhook)
        │
        └──▶ Response: Full ticket object
                │
                ▼
        ResultCard UI (Ticket ID, urgency, formal complaint)

Admin Dashboard
  GET /api/complaints ──▶ Charts, Stats, Ticket Table
```

---

## 🎬 Demo

> **Live Demo / Demo Video**: *(Add your deployed link or screen recording link here)*

### Sample Inputs to Try

| Language | Input |
|---|---|
| Hinglish | `hostel floor 3 washroom me paani tapak raha hai teen din se` |
| Hindi | `library mein AC kaam nahi kar raha, bahut garmi hai` |
| English | `The projector in Lab 2 has not been working since Monday` |

---

## 👥 Team

Built for **AI For Impact 2025** — Acropolis Institute of Technology & Research, Indore

---

<div align="center">

*"Vaak" (वाक्) means speech or voice in Sanskrit. VaakTicket gives every student a voice — in whatever language they speak.*

</div>
