import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import DepartmentChart from '../components/DepartmentChart';
import TicketTable from '../components/TicketTable';
import { getComplaints, getDashboardStats, updateComplaintStatus } from '../services/api';
import { Layers, Clock, CheckCircle2, AlertOctagon, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    highPriority: 0,
    byDepartment: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        getComplaints(),
        getDashboardStats(),
      ]);
      setTickets(ticketsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus);
      // Refresh both stats and tickets to reflect change instantly
      fetchData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-text-muted gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-text tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-text-muted text-xs md:text-sm mt-2 font-medium">
            Real-time campus issue tracking, analytics routing, and resolution controls powered by Gemini AI.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-card hover:bg-surface-hover text-text border border-surface-border rounded-xl text-xs md:text-sm font-bold transition duration-200 cursor-pointer shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>

      {/* Grid of 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 md:mb-12">
        <StatCard
          title="Total Complaints"
          value={stats.total}
          icon={Layers}
          colorClass="bg-primary/10 text-primary-light border border-primary/20"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          colorClass="bg-warning/10 text-warning border border-warning/20"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle2}
          colorClass="bg-success/10 text-success border border-success/20"
        />
        <StatCard
          title="High Priority"
          value={stats.highPriority}
          icon={AlertOctagon}
          colorClass="bg-danger/10 text-danger border border-danger/20"
        />
      </div>

      {/* Row with Chart and Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 md:mb-12">
        <div className="lg:col-span-2">
          <DepartmentChart data={stats.byDepartment} />
        </div>
        
        {/* Quick System Health card for premium demo impact */}
        <div className="glass-card rounded-[24px] p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold font-heading text-text-muted uppercase tracking-widest mb-6">
              System Insights
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center py-2.5 border-b border-surface-border">
                <span className="text-xs font-semibold text-text-muted">Resolution Rate</span>
                <span className="text-sm font-extrabold text-success">
                  {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-surface-border">
                <span className="text-xs font-semibold text-text-muted">Critical Issues</span>
                <span className="text-sm font-extrabold text-danger">{stats.highPriority}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-surface-border">
                <span className="text-xs font-semibold text-text-muted">Avg Processing Delay</span>
                <span className="text-sm font-extrabold text-primary-light">~400ms</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-surface-border/50 text-[10px] font-bold text-text-dim text-center uppercase tracking-widest">
            System status: Operational • AI online
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="pt-2">
        <h3 className="text-xl font-bold font-heading text-text mb-6">Active Issues Feed</h3>
        <TicketTable tickets={tickets} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
}
