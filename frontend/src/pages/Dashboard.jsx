import React, { useEffect, useState } from 'react';
import { PageHeader, Card, CardHeader, CardBody, Badge, Button, LoadingState, ErrorState, Skeleton, SkeletonCard, StatusBadge, EmptyState } from '../components/UI';

import { getDashboardSummary } from '../services/api';
import { FileText, Search, Activity, Flag } from 'lucide-react';

const StatCard = ({ title, value, icon, index }) => (
    <Card className={`animate-fade-in-up delay-${index * 100}`}>
        <CardBody style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', background: 'var(--primary-bg)', color: 'var(--primary)', borderRadius: 'var(--radius-lg)' }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{title}</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>{value}</div>
            </div>
        </CardBody>
    </Card>
);

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDashboardSummary();
            setSummary(data);
        } catch (err) {
            setError("Failed to load dashboard metrics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    if (error) {
        return (
            <div className="page-container animate-fade-in-up">
                <PageHeader title="Dashboard" subtitle="Monitor CSR needs, priorities, NGO matches and recommendations." />
                <ErrorState message={error} onRetry={loadData} />
            </div>
        );
    }

    return (
        <div className="page-container">
            <PageHeader title="Dashboard" subtitle="Monitor CSR needs, priorities, NGO matches and recommendations." />

            <div className="grid-4 mb-4">
                {loading ? (
                    <>
                        <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                    </>
                ) : (
                    <>
                        <StatCard index={1} title="Total CSR Needs" value={summary.metrics.total_needs} icon={<FileText size={24} />} />
                        <StatCard index={2} title="High Priority" value={summary.priority_counts.HIGH || 0} icon={<Flag size={24} />} />
                        <StatCard index={3} title="NGO Matches" value={summary.metrics.total_matches} icon={<Search size={24} />} />
                        <StatCard index={4} title="Recommendations" value={summary.metrics.total_recommendations} icon={<Activity size={24} />} />
                    </>
                )}
            </div>

            <div className="grid-2">
                <Card className="animate-fade-in-up delay-200">
                    <CardHeader><h3 className="card-title">Priority Distribution</h3></CardHeader>
                    <CardBody>
                        {loading ? <SkeletonCard /> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {['HIGH', 'MEDIUM', 'LOW'].map(pri => {
                                    const val = summary.priority_counts[pri] || 0;
                                    const max = Math.max(...Object.values(summary.priority_counts), 1);
                                    const pct = (val / max) * 100;
                                    const colors = { HIGH: 'var(--danger)', MEDIUM: '#d97706', LOW: 'var(--success)' };
                                    return (
                                        <div key={pri}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                                <span>{pri} Priority</span>
                                                <span>{val}</span>
                                            </div>
                                            <div className="score-track">
                                                <div className="score-fill" style={{ width: `${pct}%`, backgroundColor: colors[pri] }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardBody>
                </Card>

                <Card className="animate-fade-in-up delay-300">
                    <CardHeader><h3 className="card-title">CSR Status Distribution</h3></CardHeader>
                    <CardBody>
                        {loading ? <SkeletonCard /> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {Object.entries(summary.status_counts).map(([status, val]) => (
                                    <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                                        <Badge variant="neutral">{status.replace(/_/g, ' ')}</Badge>
                                        <span style={{ fontWeight: 600 }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
            
            <Card className="animate-fade-in-up delay-300 mt-4">
                <CardHeader><h3 className="card-title">Recent CSR Needs</h3></CardHeader>
                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                    {loading ? <div style={{padding: '1.5rem'}}><SkeletonCard /></div> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th style={{textAlign: 'right'}}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.recent_needs.map(need => (
                                    <tr key={need.id}>
                                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{need.description}</td>
                                        <td>{need.category}</td>
                                        <td className="text-muted">{need.city_locality || "N/A"}</td>
                                        <td style={{textAlign: 'right'}}><Badge variant="info">{need.status}</Badge></td>
                                    </tr>
                                ))}
                                {summary.recent_needs.length === 0 && (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No recent CSR needs found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
