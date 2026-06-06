import React from 'react';

export default function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-6 flex items-center justify-between shadow-lg transition-all duration-300 hover:border-surface-border/80 hover:shadow-2xl">
      <div>
        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-text mt-2 tracking-tight">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
