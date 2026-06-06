import React from 'react';

export default function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="glass-card rounded-[22px] p-6 flex items-center justify-between shadow-2xl transition-all duration-300">
      <div>
        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest font-heading">{title}</p>
        <h3 className="text-4xl font-extrabold text-text mt-3 tracking-tight font-heading">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl flex items-center justify-center shadow-inner ${colorClass}`}>
        <Icon className="w-6 h-6 shrink-0" />
      </div>
    </div>
  );
}
