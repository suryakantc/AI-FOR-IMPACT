import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, Edit2 } from 'lucide-react';

export default function TicketTable({ tickets, onStatusChange }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getUrgencyBadge = (urgency) => {
    if (urgency > 70) {
      return (
        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-danger/10 text-danger border border-danger/20">
          {urgency} (CRITICAL)
        </span>
      );
    }
    if (urgency > 40) {
      return (
        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-warning/10 text-warning border border-warning/20">
          {urgency} (HIGH)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-success/10 text-success border border-success/20">
        {urgency} (MEDIUM)
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            OPEN
          </span>
        );
      case 'IN PROGRESS':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-warning/10 text-warning border border-warning/20">
            IN PROGRESS
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-success/10 text-success border border-success/20">
            RESOLVED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-text-dim/10 text-text-dim border border-text-dim/20">
            {status}
          </span>
        );
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-xl p-8 text-center text-text-dim text-sm">
        No complaints reported yet.
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[24px] overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-border/80 bg-surface-hover/10 text-text-muted text-[10px] uppercase tracking-widest font-heading font-extrabold">
              <th className="py-4.5 px-6 font-semibold w-10"></th>
              <th className="py-4.5 px-6 font-semibold">Ticket ID</th>
              <th className="py-4.5 px-6 font-semibold">Issue Type</th>
              <th className="py-4.5 px-6 font-semibold">Department</th>
              <th className="py-4.5 px-6 font-semibold">Urgency</th>
              <th className="py-4.5 px-6 font-semibold">Status</th>
              <th className="py-4.5 px-6 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/40 text-sm">
            {tickets.map((ticket) => {
              const isExpanded = expandedId === ticket._id;
              return (
                <React.Fragment key={ticket._id}>
                  <tr
                    onClick={() => toggleExpand(ticket._id)}
                    className={`hover:bg-surface-hover/30 cursor-pointer transition-all duration-200 ${isExpanded ? 'bg-surface-hover/20' : ''}`}
                  >
                    <td className="py-4.5 px-6 text-center text-text-dim w-10">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-primary-light" /> : <ChevronDown className="w-4 h-4" />}
                    </td>
                    <td className="py-4.5 px-6 font-bold text-primary-light whitespace-nowrap">
                      {ticket.ticketId}
                    </td>
                    <td className="py-4.5 px-6 font-bold text-text">
                      {ticket.issueType}
                    </td>
                    <td className="py-4.5 px-6 font-medium text-text-muted">
                      {ticket.department}
                    </td>
                    <td className="py-4.5 px-6">
                      {getUrgencyBadge(ticket.urgency)}
                    </td>
                    <td className="py-4.5 px-6">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="py-4.5 px-6 text-[12px] font-bold text-text-dim whitespace-nowrap">
                      {formatTime(ticket.createdAt)}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-surface/30">
                      <td colSpan="7" className="py-6 px-8 border-b border-surface-border/60">
                        <div className="space-y-5 max-w-5xl animate-fade-in">
                          <div>
                            <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest block mb-2 font-heading">
                              Raw Student Input (Hinglish):
                            </span>
                            <p className="text-sm bg-surface-card/60 px-5 py-3.5 rounded-xl border border-surface-border text-text-muted leading-relaxed font-medium">
                              "{ticket.rawText}"
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold text-text-muted">
                            <div className="flex items-center gap-2.5 bg-surface-card/40 px-4 py-3 rounded-xl border border-surface-border/50">
                              <MapPin className="w-4 h-4 text-primary-light shrink-0" />
                              <span><strong>Location:</strong> {ticket.location || 'Campus'}</span>
                            </div>
                            <div className="flex items-center gap-2.5 bg-surface-card/40 px-4 py-3 rounded-xl border border-surface-border/50">
                              <Clock className="w-4 h-4 text-primary-light shrink-0" />
                              <span><strong>Duration:</strong> {ticket.duration || 'Not specified'}</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest block mb-2 font-heading">
                              AI Generated Formal English Complaint:
                            </span>
                            <p className="text-sm italic text-text bg-surface-card/60 px-5 py-4 rounded-xl border border-surface-border leading-relaxed">
                              "{ticket.formalComplaint}"
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-4 border-t border-surface-border/40">
                            <div className="flex items-center gap-2">
                              <Edit2 className="w-4 h-4 text-primary-light" />
                              <span className="text-xs font-bold text-text-muted uppercase tracking-wider font-heading">Update Lifecycle Status:</span>
                            </div>
                            <div className="flex gap-2">
                              {['OPEN', 'IN PROGRESS', 'RESOLVED'].map((s) => (
                                <button
                                  key={s}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusChange(ticket._id, s);
                                  }}
                                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 border cursor-pointer ${
                                    ticket.status === s
                                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                                      : 'bg-surface-card border-surface-border text-text-muted hover:text-text hover:bg-surface-hover'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
