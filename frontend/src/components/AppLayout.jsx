import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Search, Sparkles, Activity, Bot, ShieldCheck, UserCircle, LogOut, HelpCircle } from 'lucide-react';
import { getRole, clearRole, ROLE_CONFIGS } from '../services/auth';

const Sidebar = ({ role, onLogout }) => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <Link to="/" style={{textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <ShieldCheck size={20} /> Inspectra
      </Link>
    </div>
    <nav className="sidebar-nav">
      <NavLink to="/dashboard" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={20} />
        Dashboard
      </NavLink>

      {role !== 'NGO_PARTNER' ? (
        <>
          <NavLink to="/csr-needs" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileText size={20} />
            CSR Needs
          </NavLink>
          <NavLink to="/csr-needs" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bot size={20} />
            AI CSR Analysis
          </NavLink>
          <NavLink to="/ngo-discovery" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Search size={20} />
            NGO Discovery
          </NavLink>
        </>
      ) : (
        <NavLink to="/csr-needs" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileText size={20} />
            CSR Opportunities
        </NavLink>
      )}

      <NavLink to="/recommendations" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Sparkles size={20} />
        Recommendations
      </NavLink>
      <NavLink to="/status" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Activity size={20} />
        Status Tracking
      </NavLink>
          <NavLink to="/help" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <HelpCircle size={20} />
        Help Centre
      </NavLink>
      <NavLink to="/privacy-policy" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <FileText size={20} />
        Privacy Policy
      </NavLink>
    </nav>
    <div style={{ padding: '1rem', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
        <button 
            onClick={onLogout}
            style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
            className="btn card-hover-effect"
        >
            <LogOut size={16} /> Logout
        </button>
    </div>
  </aside>
);

const AppLayout = () => {
  const role = getRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Keyboard accessibility for Esc
  useEffect(() => {
      const handleKeyDown = (e) => {
          if (e.key === 'Escape' && showLogoutDialog) {
              setShowLogoutDialog(false);
          }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutDialog]);

  if (!role && location.pathname !== '/privacy-policy') {
      return <Navigate to="/signin" replace />;
  }

  const config = ROLE_CONFIGS[role] || ROLE_CONFIGS.CORPORATE_ADMIN;

  const handleConfirmLogout = () => {
      clearRole();
      setShowLogoutDialog(false);
      navigate('/signin');
  };

  return (
    <div className="app-layout">
      <Sidebar role={role} onLogout={() => setShowLogoutDialog(true)} />
      <div className="main-wrapper">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>{config.user}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{config.label}</div>
            </div>
            <div style={{ background: 'var(--background)', color: 'var(--accent)', padding: '0.5rem', borderRadius: '50%' }}>
                <UserCircle size={24} />
            </div>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      
      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'fadeIn 0.2s forwards' }}>
              <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.25rem' }}>Confirm Logout</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Are you sure you want to log out?</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                      <button onClick={() => setShowLogoutDialog(false)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                      <button onClick={handleConfirmLogout} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AppLayout;
