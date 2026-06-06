require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const connectDB = require('./db');
const Complaint = require('./Complaint');
const { analyzeComplaint } = require('./gemini');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// ── Ticket ID Generator ──
function generateTicketId() {
  const num = String(Math.floor(10000 + Math.random() * 90000));
  return `TK-2026-${num}`;
}

// ── Routes ──

// POST /api/complaints — analyze + save + return
app.post('/api/complaints', async (req, res) => {
  try {
    const { rawText } = req.body;

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Complaint text must be at least 5 characters'
      });
    }

    const sanitized = rawText.trim().substring(0, 500);

    // Run AI analysis
    const analysis = await analyzeComplaint(sanitized);

    // Generate ticket
    const ticketId = generateTicketId();

    const complaint = await Complaint.create({
      ticketId,
      rawText: sanitized,
      language: analysis.language,
      issueType: analysis.issueType,
      department: analysis.department,
      location: analysis.location,
      duration: analysis.duration,
      urgency: analysis.urgency,
      summary: analysis.summary,
      formalComplaint: analysis.formalComplaint,
      status: 'OPEN'
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (err) {
    console.error('POST /api/complaints error:', err);
    res.status(500).json({ success: false, error: 'Failed to process complaint' });
  }
});

// ── WhatsApp Reply Function ──
async function sendWhatsAppReply(res, to, body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (accountSid && authToken) {
    try {
      const client = twilio(accountSid, authToken);
      const from = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
      await client.messages.create({
        body: body,
        from: from,
        to: to
      });
      console.log(`Sent WhatsApp message to ${to} via Twilio REST API`);
      if (res && !res.headersSent) {
        res.status(200).json({ success: true, method: 'API' });
      }
      return;
    } catch (err) {
      console.error('Failed to send WhatsApp message via REST API client:', err);
    }
  }

  // Fallback to TwiML response
  if (res && !res.headersSent) {
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(body);
    res.type('text/xml').send(twiml.toString());
    console.log(`Sent WhatsApp message via TwiML: ${body}`);
  }
}

// POST /api/whatsapp — Twilio/WhatsApp webhook
app.post('/api/whatsapp', async (req, res) => {
  const rawText = req.body.Body;
  const from = req.body.From;

  try {
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 5) {
      const validationError = 'Complaint text must be at least 5 characters';
      await sendWhatsAppReply(res, from, validationError);
      return;
    }

    const sanitized = rawText.trim().substring(0, 500);

    // Run AI analysis
    const analysis = await analyzeComplaint(sanitized);

    // Generate ticket
    const ticketId = generateTicketId();

    // Save to MongoDB using existing Complaint model
    const complaint = await Complaint.create({
      ticketId,
      rawText: sanitized,
      language: analysis.language,
      issueType: analysis.issueType,
      department: analysis.department,
      location: analysis.location,
      duration: analysis.duration,
      urgency: analysis.urgency,
      summary: analysis.summary,
      formalComplaint: analysis.formalComplaint,
      status: 'OPEN'
    });

    // Construct response message
    const replyMessage = `Your complaint has been registered. Ticket ID: ${ticketId}, Urgency: ${analysis.urgency}/100`;

    // Reply to the student
    await sendWhatsAppReply(res, from, replyMessage);
  } catch (err) {
    console.error('POST /api/whatsapp error:', err);
    try {
      const systemError = 'We encountered an error processing your complaint. Please try again later.';
      await sendWhatsAppReply(res, from, systemError);
    } catch (sendErr) {
      console.error('Failed to send fallback error reply:', sendErr);
      if (!res.headersSent) {
        res.status(500).send('Failed to process complaint');
      }
    }
  }
});

// GET /api/complaints — return all, sorted by newest
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: complaints });
  } catch (err) {
    console.error('GET /api/complaints error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch complaints' });
  }
});

// PATCH /api/complaints/:id/status — update status
app.patch('/api/complaints/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['OPEN', 'IN PROGRESS', 'RESOLVED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }

    res.json({ success: true, data: complaint });
  } catch (err) {
    console.error('PATCH status error:', err);
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
});

// GET /api/dashboard/stats — aggregated stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const all = await Complaint.find().lean();

    const total = all.length;
    const pending = all.filter(c => c.status !== 'RESOLVED').length;
    const resolved = all.filter(c => c.status === 'RESOLVED').length;
    const highPriority = all.filter(c => c.urgency > 70).length;

    // Department distribution
    const deptMap = {};
    all.forEach(c => {
      deptMap[c.department] = (deptMap[c.department] || 0) + 1;
    });
    const byDepartment = Object.entries(deptMap).map(([name, count]) => ({ name, count }));

    res.json({
      success: true,
      data: { total, pending, resolved, highPriority, byDepartment }
    });
  } catch (err) {
    console.error('GET /api/dashboard/stats error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
