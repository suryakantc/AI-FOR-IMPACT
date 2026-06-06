import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function DepartmentChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-xl p-6 h-80 flex items-center justify-center text-text-dim text-sm">
        No department data available
      </div>
    );
  }

  const COLORS = ['#6c5ce7', '#00cec9', '#ff6b6b', '#feca57', '#00b894', '#a29bfe', '#55efc4'];

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-6 shadow-xl">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-6">
        Complaints by Department
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              angle={-35}
              textAnchor="end"
              interval={0}
              tickFormatter={(v) => v.length > 14 ? v.slice(0, 12) + '…' : v}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#12121a',
                borderColor: '#2a2a3e',
                borderRadius: '8px',
                color: '#e2e8f0',
              }}
              cursor={{ fill: 'rgba(108, 92, 231, 0.05)' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={45}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
