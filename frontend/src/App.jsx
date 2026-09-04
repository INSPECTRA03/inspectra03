import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CSRNeeds from './pages/CSRNeeds';
import CreateCSRNeed from './pages/CreateCSRNeed';
import CSRNeedDetail from './pages/CSRNeedDetail';
import NGODiscovery from './pages/NGODiscovery';
import NGODetail from './pages/NGODetail';
import PlaceholderPage from './pages/PlaceholderPage';
import Recommendations from './pages/Recommendations';
import HelpCentre from './pages/HelpCentre';
import PrivacyPolicy from './pages/PrivacyPolicy';
import StatusTracking from './pages/StatusTracking';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected layout routes (prototype) */}
        <Route path="/dashboard" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
        </Route>
        <Route path="/csr-needs" element={<AppLayout />}>
            <Route index element={<CSRNeeds />} />
            <Route path="create" element={<CreateCSRNeed />} />
            <Route path=":id" element={<CSRNeedDetail />} />
        </Route>
        <Route path="/ngo-discovery" element={<AppLayout />}>
            <Route index element={<NGODiscovery />} />
        </Route>
        <Route path="/ngos" element={<AppLayout />}>
            <Route path=":id" element={<NGODetail />} />
        </Route>
        <Route path="/recommendations" element={<AppLayout />}>
            <Route index element={<Recommendations />} />
        </Route>
        <Route path="/status" element={<AppLayout />}>
            <Route index element={<StatusTracking />} />
        </Route>
        
        <Route path="/help" element={<AppLayout />}>
            <Route index element={<HelpCentre />} />
        </Route>
        <Route path="/privacy-policy" element={<AppLayout />}>
            <Route index element={<PrivacyPolicy />} />
        </Route>

        {/* Fallback pattern */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
