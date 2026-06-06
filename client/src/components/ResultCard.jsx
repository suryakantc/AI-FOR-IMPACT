import React from 'react';
import { AlertTriangle, Clock, MapPin, CheckCircle, Copy, Check } from 'lucide-react';

export default function ResultCard({ complaint }) {
  const [copied, setCopied] = React.useState(false);

  if (!complaint) return null;

  const {
    ticketId,
    rawText,
    language,
    issueType,
    department,
    location,
    duration,
    urgency,
    summary,
    formalComplaint,
    status,
  } = complaint;

  const getUrgencyInfo = (score) => {
    if (score > 70) return { color: 'text-danger bg-danger/10 border-danger/30', label: 'CRITICAL' };
    if (score > 40) return { color: 'text-warning bg-warning/10 border-warning/30', label: 'HIGH' };
    return { color: 'text-success bg-success/10 border-success/30', label: 'MEDIUM' };
  };

  const urgencyInfo = getUrgencyInfo(urgency);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-card rounded-[24px] shadow-2xl overflow-hidden animate-fade-in-up">
      {/* Split Layout: Header Section */}
      <div className="bg-surface-hover/20 border-b border-surface-border p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-text-muted text-[10px] uppercase tracking-widest font-extrabold font-heading block">TICKET GENERATED</span>
          <div className="flex items-center gap-3 mt-2">
            <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-primary-light tracking-tight">{ticketId}</h2>
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-xl bg-surface border border-surface-border text-text-muted hover:text-text hover:bg-surface-hover transition duration-200 cursor-pointer shadow-sm"
              title="Copy Ticket ID"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-4 py-2 rounded-full text-xs font-extrabold bg-primary/20 text-primary-light border border-primary/30 animate-pulse-glow tracking-wider">
            {status}
          </span>
        </div>
      </div>

      {/* Split Layout: Body Section */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Meta-grid 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface/50 p-4 rounded-xl border border-surface-border/50 shadow-inner">
            <span className="block text-text-dim text-[10px] font-bold uppercase tracking-wider font-heading">Language</span>
            <span className="text-sm font-bold text-text mt-1.5 block">{language}</span>
          </div>
          <div className="bg-surface/50 p-4 rounded-xl border border-surface-border/50 shadow-inner">
            <span className="block text-text-dim text-[10px] font-bold uppercase tracking-wider font-heading">Issue Type</span>
            <span className="text-sm font-bold text-text mt-1.5 block">{issueType}</span>
          </div>
          <div className="bg-surface/50 p-4 rounded-xl border border-surface-border/50 shadow-inner">
            <span className="block text-text-dim text-[10px] font-bold uppercase tracking-wider font-heading">Department</span>
            <span className="text-sm font-bold text-text mt-1.5 block truncate" title={department}>{department}</span>
          </div>
          <div className={`p-4 rounded-xl border shadow-inner ${urgencyInfo.color}`}>
            <span className="block text-[10px] font-bold uppercase tracking-wider font-heading opacity-80">Urgency</span>
            <span className="text-sm font-extrabold mt-1.5 block flex items-center gap-1.5">
              {urgency} <span className="text-[9px] font-extrabold tracking-wider">({urgencyInfo.label})</span>
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm bg-surface-card/40 px-4 py-3 rounded-xl border border-surface-border/50">
              <MapPin className="w-4 h-4 text-primary-light mt-0.5 shrink-0" />
              <div>
                <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider block font-heading">Location</span>
                <span className="text-sm font-medium text-text mt-0.5 block">{location || 'Campus'}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm bg-surface-card/40 px-4 py-3 rounded-xl border border-surface-border/50">
              <Clock className="w-4 h-4 text-primary-light mt-0.5 shrink-0" />
              <div>
                <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider block font-heading">Duration / Period</span>
                <span className="text-sm font-medium text-text mt-0.5 block">{duration || 'Not specified'}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-card/40 px-5 py-4 rounded-xl border border-surface-border/50">
            <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider block mb-2 font-heading">Summary</span>
            <p className="text-sm font-semibold leading-relaxed text-text">
              {summary}
            </p>
          </div>
        </div>

        {/* Translation Section */}
        <div className="border-t border-surface-border pt-6">
          <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider block mb-2 font-heading">Formal Complaint (English Translation)</span>
          <div className="relative bg-surface/50 border border-surface-border rounded-xl p-4 md:p-5 shadow-inner">
            <p className="text-sm leading-relaxed text-text italic font-medium">
              "{formalComplaint}"
            </p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <span className="text-text-dim text-[10px] font-bold uppercase tracking-wider">
            AI-generated ticket. Campus Administration has been notified.
          </span>
        </div>
      </div>
    </div>
  );
}