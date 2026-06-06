# 🎟️ VaakTicket AI
> **An AI-powered Multilingual Campus Complaint Triage & Routing System**

VaakTicket AI is a modern MERN stack application designed for college campuses. It allows students to submit unstructured complaints in Hindi, English, or mixed Hinglish text. The system automatically processes the input using **Google Gemini AI** to detect the language, translate the text to formal English, classify the issue type, assign the target department, determine the location and duration, compute an urgency score, and generate a trackable ticket. It also features a **Twilio WhatsApp Webhook** to let students file complaints directly via WhatsApp.

---

## 🚀 Key Features

*   **🗣️ Multilingual Input Support**: Students can write in pure Hindi, English, or conversational Hinglish (e.g., *"hostel floor 3 washroom me paani tapak raha hai"*).
*   **🧠 Gemini AI Processing Pipeline**: Instantly processes raw complaints to extract key metadata:
    *   *Language detection* (Hindi, English, Hinglish, etc.)
    *   *Department mapping* (Plumbing, Electrical, IT Support, Library, Mess Committee, etc.)
    *   *Urgency scoring* (0-100 based on safety risks and duration)
    *   *Formal English Translation* (generates a professional, structured request)
*   **📱 WhatsApp Webhook Integration**: Enabled via Twilio, letting students file complaints on the go with real-time ticket confirmation SMS replies.
*   **📊 Administrative Dashboard**:
    *   Real-time analytics & graphs (using Recharts) for issues by department.
    *   System Health statistics (Total, Pending, Resolved, High Priority).
    *   Interactive data table with expandable detail rows and live status updates.
*   **✨ Premium UI/UX**: Designed with deep space radial gradients, responsive glassmorphism containers, smooth animations, and clear stepper progress indicators.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite) + Tailwind CSS v4 + Lucide Icons + Recharts
*   **Backend**: Node.js + Express.js
*   **Database**: MongoDB Atlas + Mongoose ODM
*   **AI Models**: Google Gemini AI (`gemini-2.0-flash` / `gemini-3.5-flash` with robust JSON fallback)
*   **Integrations**: Twilio API for WhatsApp Messaging Webhooks

---

## 📂 Project Structure

```bash
AI-FOR-IMPACT/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI Elements (StatCard, TicketTable, Chart)
│   │   ├── pages/          # SubmitPage (Student view) & AdminPage (Admin dashboard)
│   │   ├── services/       # Axios API client setup
│   │   ├── App.jsx         # Routing & Layout
│   │   ├── index.css       # Tailwind Theme & Custom CSS animations
│   │   └── main.jsx
│   └── package.json
├── server/                 # Express Backend
│   ├── Complaint.js        # Mongoose schema for complaints
│   ├── db.js               # MongoDB connection config
│   ├── gemini.js           # Gemini AI extraction pipeline & prompts
│   ├── index.js            # Express API endpoints & Twilio webhook handler
│   ├── seed.js             # Test database seed script
│   └── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas connection string
*   Google Gemini API Key
*   Twilio Account (Optional, for WhatsApp webhook testing)

### 1. Server Configuration
Create `server/.env` with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.hdu2hwl.mongodb.net/campusflow?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here

# Twilio Credentials (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

Install server dependencies, seed the database with mock records, and start the development server:
```bash
cd server
npm install
npm run seed     # Seeds DB with initial tickets for dashboard graphs
npm run dev
```

### 2. Client Configuration
Create `client/.env` with:
```env
VITE_API_URL=http://localhost:5000
```

Install client dependencies and start Vite:
```bash
cd ../client
npm install
npm run dev
```

The frontend will run at `http://localhost:5173/`.

---

## 🤖 Gemini AI Prompting & Fallback Architecture

The system queries the Gemini API with structured instructions requiring it to reply with **valid JSON only** matching the following schema:
```json
{
  "language": "Hindi-English" | "Hindi" | "English" | "Other",
  "issueType": "Electrical" | "Plumbing" | "Internet" | "Mess" | "Hostel" | "Academic" | "Library" | "Administrative" | "Other",
  "department": "string",
  "location": "string",
  "duration": "string",
  "urgency": number (0-100),
  "summary": "string under 20 words in English",
  "formalComplaint": "string 2-3 sentences professional English"
}
```

### 🛡️ Robust Fallback & Error Handling
1. **JSON Cleaning**: Standardizes responses and strips any markdown backticks (````json ... ````) or preamble text.
2. **Retries**: Retries the API call on failure.
3. **Local Fallback Engine**: If both API attempts fail, a regex-based helper (`detectIssueType`) extracts basic categories from the student input and assigns a default safe ticket structure to ensure zero downtime.

---

## 📱 WhatsApp Webhook Setup (Twilio)

1. Open your Twilio Console and navigate to the **Twilio Sandbox for WhatsApp**.
2. Set the webhook URL for incoming messages to:
   `https://<your-ngrok-or-server-domain>/api/whatsapp` using **HTTP POST**.
3. Send any message in Hinglish to the sandbox number.
4. You will instantly receive a response back:
   > *"Your complaint has been registered. Ticket ID: TK-2026-XXXXX, Urgency: XX/100"*