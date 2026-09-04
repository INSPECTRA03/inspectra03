import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Search, Sparkles, Activity, ShieldCheck, LogOut, HelpCircle, UserCircle } from 'lucide-react';
import { getRole, clearRole } from '../services/auth';
import { Button } from './UI';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Runtime Error Caught by Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{this.state.error && this.state.error.toString()}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Reload page</button>
        </div>
      );
    }
    return this.props.children; 
  }
}

const AppLayout = () => {
  const role = getRole();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  // Note: /privacy-policy is exposed without role block naturally now.
  if (!role && location.pathname !== '/privacy-policy') {
    return <Navigate to="/signin" replace />;
  }

  const handleLogout = () => {
    clearRole();
    window.location.href = '/signin';
  };

  const getRoleLabel = (r) => {
    if (r === 'CSR_ADMIN') return 'Corporate CSR Admin';
    if (r === 'CSR_MANAGER') return 'CSR Manager';
    if (r === 'NGO_PARTNER') return 'NGO Partner';
    return r;
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="sidebar-header">
            <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.4rem', borderRadius: 'var(--radius-md)' }}>
                <ShieldCheck size={20} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Inspectra</span>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-group-title">Workspace</div>
          <NavLink to="/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          
          {(role === 'CSR_ADMIN' || role === 'CSR_MANAGER') && (
            <NavLink to="/csr-needs" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} /> CSR Needs
            </NavLink>
          )}

          <NavLink to="/ngo-discovery" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Search size={18} /> NGO Discovery
          </NavLink>

          {(role === 'CSR_ADMIN' || role === 'CSR_MANAGER') && (
              <NavLink to="/recommendations" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Sparkles size={18} /> Recommendations
              </NavLink>
          )}

          <NavLink to="/status" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Activity size={18} /> Status Tracking
          </NavLink>

          <div className="nav-group-title" style={{ marginTop: '2rem' }}>Resources</div>
          <NavLink to="/help" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <HelpCircle size={18} /> Help Centre
          </NavLink>
          <NavLink to="/privacy-policy" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileText size={18} /> Privacy Policy
          </NavLink>
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.5rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <UserCircle size={32} color="var(--text-tertiary)" />
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{getRoleLabel(role)}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Authenticated Session</div>
                </div>
            </div>
            <button 
                onClick={() => setShowLogout(true)}
                className="btn" 
                style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--text-secondary)', padding: '0.6rem 0.75rem' }}
            >
                <LogOut size={18} /> Log out
            </button>
        </div>
      </aside>

      <main className="main-content">
        <ErrorBoundary><Outlet /></ErrorBoundary>
      </main>

      {/* Logout Modal */}
      {showLogout && (
          <div className="modal-overlay" onClick={() => setShowLogout(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Log out?</h3>
                  </div>
                  <div style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>
                      Are you sure you want to log out of your current session?
                  </div>
                  <div style={{ padding: '1rem 1.5rem', background: 'var(--background)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <Button variant="secondary" onClick={() => setShowLogout(false)}>Cancel</Button>
                      <Button variant="danger" onClick={handleLogout}>Logout</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AppLayout;
