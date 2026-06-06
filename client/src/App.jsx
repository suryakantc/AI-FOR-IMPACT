import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import SubmitPage from './pages/SubmitPage';
import AdminPage from './pages/AdminPage';
import { ShieldCheck, MessageSquarePlus } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-surface-border bg-surface bg-opacity-75 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
              CF
            </div>
            <span className="font-extrabold text-lg text-text tracking-tight">
              campus<span className="text-primary-light">flow</span>
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              to="/submit"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition duration-200 border ${
                isActive('/submit')
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-transparent border-transparent text-text-muted hover:text-text hover:bg-surface-hover'
              }`}
            >
              <MessageSquarePlus className="w-4 h-4" />
              File Complaint
            </Link>
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition duration-200 border ${
                isActive('/admin')
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-transparent border-transparent text-text-muted hover:text-text hover:bg-surface-hover'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/submit" replace />} />
          </Routes>
        </main>
        <footer className="border-t border-surface-border py-6 text-center text-text-dim text-xs">
          © {new Date().getFullYear()} CampusFlow AI Systems. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}
