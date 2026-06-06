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
    <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-border bg-surface-hover/20 text-text-muted text-xs uppercase tracking-wider">
              <th className="py-4 px-6 font-semibold"></th>
              <th className="py-4 px-6 font-semibold">Ticket ID</th>
              <th className="py-4 px-6 font-semibold">Issue Type</th>
              <th className="py-4 px-6 font-semibold">Department</th>
              <th className="py-4 px-6 font-semibold">Urgency</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50 text-sm">
            {tickets.map((ticket) => {
              const isExpanded = expandedId === ticket._id;
              return (
                <React.Fragment key={ticket._id}>
                  <tr
                    onClick={() => toggleExpand(ticket._id)}
                    className="hover:bg-surface-hover/30 cursor-pointer transition-all"
                  >
                    <td className="py-4 px-6 text-center text-text-dim w-10">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </td>
                    <td className="py-4 px-6 font-bold text-primary-light whitespace-nowrap">
                      {ticket.ticketId}
                    </td>
                    <td className="py-4 px-6 font-medium text-text">
                      {ticket.issueType}
                    </td>
                    <td className="py-4 px-6 text-text-muted">
                      {ticket.department}
                    </td>
                    <td className="py-4 px-6">
                      {getUrgencyBadge(ticket.urgency)}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="py-4 px-6 text-text-dim whitespace-nowrap">
                      {formatTime(ticket.createdAt)}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-surface-hover/10">
                      <td colSpan="7" className="py-5 px-8 border-b border-surface-border">
                        <div className="space-y-4 max-w-4xl animate-fade-in">
                          <div>
                            <span className="text-xs font-semibold text-text-muted block mb-1">
                              Raw Student Input (Hinglish):
                            </span>
                            <p className="text-sm bg-surface-hover/35 px-4 py-2.5 rounded-lg border border-surface-border/40 text-text-muted">
                              "{ticket.rawText}"
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-muted">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary-light" />
                              <span><strong>Location:</strong> {ticket.location || 'Campus'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary-light" />
                              <span><strong>Duration:</strong> {ticket.duration || 'Not specified'}</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-semibold text-text-muted block mb-1">
                              AI Generated Formal English Complaint:
                            </span>
                            <p className="text-sm italic text-text bg-surface-hover/40 px-4 py-3 rounded-lg border border-surface-border">
                              "{ticket.formalComplaint}"
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-3 border-t border-surface-border/30">
                            <div className="flex items-center gap-2">
                              <Edit2 className="w-3.5 h-3.5 text-primary-light" />
                              <span className="text-xs font-medium text-text-muted">Update Lifecycle Status:</span>
                            </div>
                            <div className="flex gap-2">
                              {['OPEN', 'IN PROGRESS', 'RESOLVED'].map((s) => (
                                <button
                                  key={s}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusChange(ticket._id, s);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                    ticket.status === s
                                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
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
