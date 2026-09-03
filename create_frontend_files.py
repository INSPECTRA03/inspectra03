import os

base_dir = r'C:\Users\balag\.gemini\antigravity\scratch\inspectra\frontend\src'

files = {
    'index.css': '''
:root {
  --primary-color: #0f172a;
  --secondary-color: #334155;
  --accent-color: #2563eb;
  --accent-hover: #1d4ed8;
  --bg-color: #f8fafc;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --sidebar-width: 250px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-primary);
}
.app-container {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: var(--sidebar-width);
  background-color: white;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--accent-color);
}
.nav-links {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  gap: 0.25rem;
}
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  gap: 0.75rem;
}
.nav-link:hover {
  background-color: #f1f5f9;
  color: var(--primary-color);
}
.nav-link.active {
  background-color: #eff6ff;
  color: var(--accent-color);
  border-right: 3px solid var(--accent-color);
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.header {
  height: 64px;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 2rem;
}
.content-wrapper {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}
.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
}
.stat-card-title {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.stat-card-value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
}
.placeholder-page {
  background: white;
  padding: 3rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  text-align: center;
  color: var(--text-secondary);
}
''',
    'App.jsx': '''
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Search, Star, Activity } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';
import './index.css';

const Sidebar = () => (
  <div className="sidebar">
    <div className="sidebar-header">
      Inspectra
    </div>
    <div className="nav-links">
      <NavLink to="/" className={({ isActive }) => \
av-link \\} end>
        <LayoutDashboard size={20} />
        Dashboard
      </NavLink>
      <NavLink to="/csr-needs" className={({ isActive }) => \
av-link \\}>
        <FileText size={20} />
        CSR Needs
      </NavLink>
      <NavLink to="/ngo-discovery" className={({ isActive }) => \
av-link \\}>
        <Search size={20} />
        NGO Discovery
      </NavLink>
      <NavLink to="/recommendations" className={({ isActive }) => \
av-link \\}>
        <Star size={20} />
        Recommendations
      </NavLink>
      <NavLink to="/status" className={({ isActive }) => \
av-link \\}>
        <Activity size={20} />
        Status
      </NavLink>
    </div>
  </div>
);

const Header = () => (
  <div className="header">
    <div style={{fontWeight: 500, color: 'var(--secondary-color)'}}>Admin User</div>
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
              <Route path="/csr-needs" element={<PlaceholderPage title="CSR Needs" description="CSR Need Assessment Form & Database." />} />
              <Route path="/ngo-discovery" element={<PlaceholderPage title="NGO Discovery" description="Browse and search verified NGOs." />} />
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
''',
    'pages/Dashboard.jsx': '''
import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card-title">Total CSR Needs</div>
          <div className="stat-card-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">High Priority Needs</div>
          <div className="stat-card-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">NGO Matches</div>
          <div className="stat-card-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">Shortlisted NGOs</div>
          <div className="stat-card-value">0</div>
        </div>
      </div>
      <div className="placeholder-page" style={{padding: '2rem'}}>
        <h2>Current Status Overview</h2>
        <p style={{marginTop: '1rem'}}>Active projects and workflows will appear here.</p>
      </div>
    </div>
  );
};

export default Dashboard;
''',
    'pages/PlaceholderPage.jsx': '''
import React from 'react';

const PlaceholderPage = ({ title, description }) => {
  return (
    <div>
      <h1 className="page-title">{title}</h1>
      <div className="placeholder-page">
        <h2 style={{color: 'var(--primary-color)', marginBottom: '1rem'}}>{title} Feature</h2>
        <p>{description}</p>
        <p style={{marginTop: '2rem', fontSize: '0.875rem'}}>This feature is pending implementation in Stage 2.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
''',
    'main.jsx': '''
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
'''
}

for rel_path, content in files.items():
    path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())
