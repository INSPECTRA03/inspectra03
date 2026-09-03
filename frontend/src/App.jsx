import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Search, Star, Activity } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CSRNeeds from './pages/CSRNeeds';
import CreateCSRNeed from './pages/CreateCSRNeed';
import CSRNeedDetail from './pages/CSRNeedDetail';
import NGODiscovery from './pages/NGODiscovery';
import NGODetail from './pages/NGODetail';
import PlaceholderPage from './pages/PlaceholderPage';
import './index.css';

const Sidebar = () => (
  <div className="sidebar">
    <div className="sidebar-header">
      Inspectra
    </div>
    <div className="nav-links">
      <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
        <LayoutDashboard size={20} />
        Dashboard
      </NavLink>
      <NavLink to="/csr-needs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <FileText size={20} />
        CSR Needs
      </NavLink>
      <NavLink to="/ngo-discovery" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Search size={20} />
        NGO Discovery
      </NavLink>
      <NavLink to="/recommendations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Star size={20} />
        Recommendations
      </NavLink>
      <NavLink to="/status" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Activity size={20} />
        Status
      </NavLink>
    </div>
  </div>
);

const Header = () => (
  <div className="header">
    <div style={{ fontWeight: 500, color: 'var(--secondary-color)' }}>Admin User</div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/csr-needs" element={<CSRNeeds />} />
              <Route path="/csr-needs/create" element={<CreateCSRNeed />} />
              <Route path="/csr-needs/:id" element={<CSRNeedDetail />} />
              <Route path="/ngo-discovery" element={<NGODiscovery />} />
              <Route path="/ngos/:id" element={<NGODetail />} />
              <Route path="/recommendations" element={<PlaceholderPage title="Recommendations" description="AI Matches & Explainable Recommendations." />} />
              <Route path="/status" element={<PlaceholderPage title="Status" description="CSR Status Tracking & Partnership Dashboard." />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;