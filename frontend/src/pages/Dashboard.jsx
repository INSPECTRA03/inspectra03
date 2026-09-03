import React, { useEffect, useState } from 'react';
import { fetchCSRNeeds, fetchNGOs } from '../services/api';

const Dashboard = () => {
  const [needsCount, setNeedsCount] = useState(0);
  const [ngosCount, setNgosCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const needs = await fetchCSRNeeds();
        const ngos = await fetchNGOs();
        setNeedsCount(needs.length);
        setNgosCount(ngos.length);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card-title">Total CSR Needs</div>
          <div className="stat-card-value">{needsCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">High Priority Needs</div>
          <div className="stat-card-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">Available NGOs</div>
          <div className="stat-card-value">{ngosCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">Shortlisted NGOs</div>
          <div className="stat-card-value">0</div>
        </div>
      </div>
      <div className="placeholder-page" style={{ padding: '2rem' }}>
        <h2>Current Status Overview</h2>
        <p style={{ marginTop: '1rem' }}>Active projects and workflows will appear here.</p>
      </div>
    </div>
  );
};

export default Dashboard;