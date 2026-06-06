const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `You are a complaint analysis engine for an Indian college campus. Return ONLY valid JSON. No markdown. No explanation. No code blocks. No preamble.`;

function buildPrompt(rawText) {
  return `Analyze this student complaint and return JSON with exactly these fields:
{
  "language": "Hindi-English" | "Hindi" | "English" | "Other",
  "issueType": "Electrical" | "Plumbing" | "Internet" | "Mess" | "Hostel" | "Academic" | "Library" | "Administrative" | "Other",
  "department": string,
  "location": string,
  "duration": string,
  "urgency": number 0-100,
  "summary": string under 20 words in English,
  "formalComplaint": string 2-3 sentences professional English
}

Urgency rules:
- Safety risk: 85-100
- Basic amenity failure: 60-84
- Duration >2 days: add 10
- Duration >5 days: add 20 more
- Multiple students affected: add 15

Complaint: "${rawText}"`;
}

function detectIssueType(text) {
  const t = text.toLowerCase();
  if (t.includes('fan') || t.includes('light') || t.includes('electric') || t.includes('bijli')) return 'Electrical';
  if (t.includes('mess') || t.includes('khana') || t.includes('food') || t.includes('khaana')) return 'Mess';
  if (t.includes('hostel') || t.includes('room') || t.includes('kamra')) return 'Hostel';
  if (t.includes('library') || t.includes('kitab')) return 'Library';
  if (t.includes('wifi') || t.includes('internet') || t.includes('net')) return 'Internet';
  if (t.includes('water') || t.includes('paani') || t.includes('tap')) return 'Plumbing';
  return 'Other';
}

function getFallback(rawText) {
  return {
    language: 'Hindi-English',
    issueType: detectIssueType(rawText),
    department: 'General Maintenance',
    location: 'Campus',
    duration: 'Not specified',
    urgency: 50,
    summary: 'Student complaint requires administrative review',
    formalComplaint: 'A student has submitted a complaint that requires prompt administrative attention. The issue has been logged and assigned for review. Please investigate and respond within 24 hours.'
  };
}

const VALID_ISSUE_TYPES = ['Electrical', 'Plumbing', 'Internet', 'Mess', 'Hostel', 'Academic', 'Library', 'Administrative', 'Other'];

function parseAndValidate(raw) {
  let cleaned = raw.trim();
  // strip markdown fences if present
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  // strip any preamble/postamble — extract the first { ... } block
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0].trim();

  const parsed = JSON.parse(cleaned);

  return {
    language: typeof parsed.language === 'string' ? parsed.language : 'Hindi-English',
    issueType: VALID_ISSUE_TYPES.includes(parsed.issueType) ? parsed.issueType : 'Other',
    department: typeof parsed.department === 'string' ? parsed.department : 'General Maintenance',
    location: typeof parsed.location === 'string' ? parsed.location : 'Campus',
    duration: typeof parsed.duration === 'string' ? parsed.duration : 'Not specified',
    urgency: typeof parsed.urgency === 'number' && parsed.urgency >= 0 && parsed.urgency <= 100
      ? Math.round(parsed.urgency) : 50,
    summary: typeof parsed.summary === 'string' && parsed.summary.length > 0
      ? parsed.summary.substring(0, 200) : 'Student complaint logged',
    formalComplaint: typeof parsed.formalComplaint === 'string' && parsed.formalComplaint.length > 0
      ? parsed.formalComplaint.substring(0, 1000) : ''
  };
}

async function callGemini(rawText) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
      maxOutputTokens: 2048
    }
  });

  const result = await model.generateContent(buildPrompt(rawText));
  return result.response.text();
}

async function analyzeComplaint(rawText) {
  // Attempt 1
  try {
    const response = await callGemini(rawText);
    return parseAndValidate(response);
  } catch (err) {
    console.warn('Gemini attempt 1 failed:', err.message);
  }

  // Attempt 2 — retry
  try {
    const response = await callGemini(rawText);
    return parseAndValidate(response);
  } catch (err) {
    console.warn('Gemini attempt 2 failed:', err.message);
  }

  // Fallback
  console.error('Both Gemini attempts failed. Using fallback.');
  return getFallback(rawText);
}

module.exports = { analyzeComplaint };
