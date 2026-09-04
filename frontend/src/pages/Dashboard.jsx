import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../services/api';
import { PageHeader, MetricCard, LoadingState, ErrorState, StatusBadge } from '../components/UI';
import { Plus, Search, Activity, Sparkles, FileText, Bot } from 'lucide-react';
import { getRole } from '../services/auth';

// 1. Corporate Admin View (Broadest visibility)
const CorporateDashboard = ({ summary }) => {
  const { metrics, status_counts, priority_counts, recent_needs } = summary;
  
  return (
    <div className="animate-fade-in-up">
      <PageHeader 
        title="CSR Dashboard" 
        subtitle="Monitor CSR initiatives, priorities, NGO partnerships and impact across your organization."
      />
      <div className="form-grid mb-4 animate-fade-in-up stagger-2">
        <MetricCard title="Total CSR Needs" value={metrics.total_csr_needs} />
        <MetricCard title="High Priority Needs" value={metrics.high_priority_needs} />
        <MetricCard title="NGO Matches" value={metrics.total_matches} />
        <MetricCard title="Recommendations" value={metrics.total_recommendations} />
      </div>

      <div className="form-grid mb-4 animate-fade-in-up stagger-2">
        <div className="card animate-fade-in-up stagger-4">
            <div className="card-header"><h3 className="card-title" style={{margin: 0}}>CSR Needs by Status</h3></div>
            <div className="card-body">
                <table className="data-table">
                    <tbody>
                        <tr><td><StatusBadge status="NEED_IDENTIFIED" type="status" /></td><td style={{textAlign: 'right'}}>{status_counts.NEED_IDENTIFIED || 0}</td></tr>
                        <tr><td><StatusBadge status="AI_ASSESSMENT" type="status" /></td><td style={{textAlign: 'right'}}>{status_counts.AI_ASSESSMENT || 0}</td></tr>
                        <tr><td><StatusBadge status="PRIORITIZED" type="status" /></td><td style={{textAlign: 'right'}}>{status_counts.PRIORITIZED || 0}</td></tr>
                        <tr><td><StatusBadge status="MATCHED" type="status" /></td><td style={{textAlign: 'right'}}>{status_counts.MATCHED || 0}</td></tr>
                        <tr><td><StatusBadge status="RECOMMENDED" type="status" /></td><td style={{textAlign: 'right'}}>{status_counts.RECOMMENDED || 0}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="card animate-fade-in-up stagger-4">
            <div className="card-header"><h3 className="card-title" style={{margin: 0}}>Priority Distribution</h3></div>
            <div className="card-body">
                <table className="data-table">
                    <tbody>
                        <tr><td><StatusBadge status="HIGH" type="priority" /></td><td style={{textAlign: 'right'}}>{priority_counts.HIGH || 0}</td></tr>
                        <tr><td><StatusBadge status="MEDIUM" type="priority" /></td><td style={{textAlign: 'right'}}>{priority_counts.MEDIUM || 0}</td></tr>
                        <tr><td><StatusBadge status="LOW" type="priority" /></td><td style={{textAlign: 'right'}}>{priority_counts.LOW || 0}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      <div className="card mb-4 animate-fade-in-up stagger-3">
        <div className="card-header"><h2 className="card-title" style={{margin: 0}}>Quick Actions</h2></div>
        <div className="card-body" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          <Link to="/csr-needs/create" className="btn btn-primary"><Plus size={16} /> Create CSR Need</Link>
          <Link to="/csr-needs" className="btn btn-secondary"><FileText size={16} /> View CSR Needs</Link>
          <Link to="/csr-needs" className="btn btn-secondary"><Bot size={16} /> AI CSR Analysis</Link>
          <Link to="/ngo-discovery" className="btn btn-secondary"><Search size={16} /> NGO Discovery</Link>
          <Link to="/recommendations" className="btn btn-secondary"><Sparkles size={16} /> Recommendations</Link>
          <Link to="/status" className="btn btn-secondary"><Activity size={16} /> Status Tracking</Link>
        </div>
      </div>

      <RecentCSRNeedsTable recent_needs={recent_needs} />
    </div>
  );
};

// 2. CSR Manager View (Operational focus)
const ManagerDashboard = ({ summary }) => {
  const { metrics, status_counts, priority_counts, recent_needs } = summary;
  
  return (
    <div className="animate-fade-in-up">
      <PageHeader 
        title="CSR Operations" 
        subtitle="Track CSR requirements, priorities and recommended NGO partners."
      />
      <div className="form-grid mb-4 animate-fade-in-up stagger-2">
        <MetricCard title="Total CSR Needs" value={metrics.total_csr_needs} />
        <MetricCard title="High Priority Needs" value={metrics.high_priority_needs} />
        <MetricCard title="Pending AI Assessments" value={status_counts.NEED_IDENTIFIED || 0} />
        <MetricCard title="Pending NGO Matching" value={(status_counts.AI_ASSESSMENT || 0) + (status_counts.PRIORITIZED || 0)} />
      </div>

      <div className="form-grid mb-4 animate-fade-in-up stagger-2">
        <div className="card animate-fade-in-up stagger-4">
            <div className="card-header"><h3 className="card-title" style={{margin: 0}}>Priority Distribution</h3></div>
            <div className="card-body">
                <table className="data-table">
                    <tbody>
                        <tr><td><StatusBadge status="HIGH" type="priority" /></td><td style={{textAlign: 'right'}}>{priority_counts.HIGH || 0}</td></tr>
                        <tr><td><StatusBadge status="MEDIUM" type="priority" /></td><td style={{textAlign: 'right'}}>{priority_counts.MEDIUM || 0}</td></tr>
                        <tr><td><StatusBadge status="LOW" type="priority" /></td><td style={{textAlign: 'right'}}>{priority_counts.LOW || 0}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="card animate-fade-in-up stagger-4">
            <div className="card-header"><h3 className="card-title" style={{margin: 0}}>CSR Status Distribution</h3></div>
            <div className="card-body">
                <table className="data-table">
                    <tbody>
                        <tr><td><StatusBadge status="AI_ASSESSMENT" type="status" /></td><td style={{textAlign: 'right'}}>{status_counts.AI_ASSESSMENT || 0}</td></tr>
                        <tr><td><StatusBadge status="PRIORITIZED" type="status" /></td><td style={{textAlign: 'right'}}>{status_counts.PRIORITIZED || 0}</td></tr>
                        <tr><td><StatusBadge status="MATCHED" type="status" /></td><td style={{textAlign: 'right'}}>{status_counts.MATCHED || 0}</td></tr>
                        <tr><td><StatusBadge status="RECOMMENDED" type="status" /></td><td style={{textAlign: 'right'}}>{status_counts.RECOMMENDED || 0}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      <div className="card mb-4 animate-fade-in-up stagger-3">
        <div className="card-header"><h2 className="card-title" style={{margin: 0}}>Quick Actions</h2></div>
        <div className="card-body" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          <Link to="/csr-needs/create" className="btn btn-primary"><Plus size={16} /> Create CSR Need</Link>
          <Link to="/csr-needs" className="btn btn-secondary"><Bot size={16} /> AI CSR Analysis</Link>
          <Link to="/ngo-discovery" className="btn btn-secondary"><Search size={16} /> NGO Discovery</Link>
          <Link to="/recommendations" className="btn btn-secondary"><Sparkles size={16} /> Recommendations</Link>
          <Link to="/status" className="btn btn-secondary"><Activity size={16} /> Status Tracking</Link>
        </div>
      </div>

      <RecentCSRNeedsTable recent_needs={recent_needs} />
    </div>
  );
};

// 3. NGO Partner View (Opportunity focus)
const NGODashboard = ({ summary }) => {
  const { metrics, status_counts, recent_needs } = summary;
  
  return (
    <div className="animate-fade-in-up">
      <PageHeader 
        title="NGO Partner Dashboard" 
        subtitle="Review relevant CSR opportunities and manage your partnership pipeline."
      />
      
      <div className="form-grid mb-4 animate-fade-in-up stagger-2">
        <MetricCard title="Relevant CSR Needs" value={metrics.total_csr_needs} />
        <MetricCard title="Matched Opportunities" value={metrics.total_matches} />
        <MetricCard title="Recommended Opportunities" value={metrics.total_recommendations} />
        <MetricCard title="Active CSR Opportunities" value={status_counts.RECOMMENDED || 0} />
      </div>

      <div className="card animate-fade-in-up stagger-4">
        <div className="card-header"><h2 className="card-title" style={{margin: 0}}>CSR Opportunities</h2></div>
        <div className="card-body">
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem'}}>
              {recent_needs.map(need => (
                  <div key={need.id} style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                          <h4 style={{margin: 0, color: 'var(--primary)'}}>CSR Need #{need.id}</h4>
                          <StatusBadge status={need.priority || 'PENDING'} type="priority" />
                      </div>
                      <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem'}}>{need.category}</div>
                      <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem'}}>{need.location ? `${need.location.city}, ${need.location.state}` : "Unknown Locations"}</div>
                      <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem'}}>{need.beneficiary_count} Beneficiaries</div>
                      
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)'}}>
                          <StatusBadge status={need.status} type="status" />
                          <Link to={`/csr-needs/${need.id}`} className="btn btn-secondary" style={{padding: '0.25rem 0.75rem', fontSize: '0.75rem'}}>View CSR Need</Link>
                      </div>
                  </div>
              ))}
              {recent_needs.length === 0 && (
                  <div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1'}}>
                      No CSR opportunities available right now.
                  </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};


// Shared Recent CSR Needs Table Component
const RecentCSRNeedsTable = ({ recent_needs }) => (
    <div className="card animate-fade-in-up stagger-4">
      <div className="card-header">
        <h2 className="card-title" style={{margin: 0}}>Recent CSR Needs</h2>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>CSR Need</th>
              <th>Category</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent_needs.map(need => (
              <tr key={need.id}>
                <td style={{fontWeight: 500}}>
                  <Link to={`/csr-needs/${need.id}`} style={{textDecoration: 'none', color: 'var(--accent)'}}>
                    Need #{need.id}
                  </Link>
                </td>
                <td>{need.category}</td>
                <td className="text-muted">{need.location ? `${need.location.city}, ${need.location.state}` : "Unknown"}</td>
                <td><StatusBadge status={need.priority || 'PENDING'} type="priority" /></td>
                <td><StatusBadge status={need.status} type="status" /></td>
              </tr>
            ))}
            {recent_needs.length === 0 && (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                  No CSR needs identified yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
);


const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = getRole();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    loadData();
  }, [role]);

  if (loading) return <LoadingState message="Connecting to Inspectra backend..." />;
  if (error) return <ErrorState message={error} />;
  
  if (role === 'NGO_PARTNER') return <NGODashboard summary={summary} />;
  if (role === 'CSR_MANAGER') return <ManagerDashboard summary={summary} />;
  return <CorporateDashboard summary={summary} />;
};

export default Dashboard;
