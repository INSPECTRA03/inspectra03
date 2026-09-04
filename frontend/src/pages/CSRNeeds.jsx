import React, { useEffect, useState } from 'react';
import { PageHeader, Card, CardHeader, CardBody, Badge, Button, LoadingState, ErrorState, Skeleton, SkeletonCard, StatusBadge, EmptyState } from '../components/UI';

import { Link } from 'react-router-dom';
import { fetchCSRNeeds } from '../services/api';
import { Plus } from 'lucide-react';

const CSRNeeds = () => {
    const [needs, setNeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadNeeds = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCSRNeeds();
            setNeeds(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch CSR Needs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadNeeds(); }, []);

    if (error) {
        return (
            <div className="page-container animate-fade-in-up">
                <PageHeader title="CSR Needs" subtitle="Create, monitor and manage CSR requirements." />
                <ErrorState message={error} onRetry={loadNeeds} />
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in-up">
            <PageHeader 
                title="CSR Needs" 
                subtitle="Create, monitor and manage CSR requirements."
                action={
                    <Link to="/csr-needs/create">
                        <Button variant="primary"><Plus size={18} /> Create CSR Need</Button>
                    </Link>
                }
            />

            <Card>
                {loading ? <LoadingState /> : (
                    <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Location</th>
                                    <th>Category</th>
                                    <th>Urgency</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th style={{textAlign: 'right'}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {needs.map(need => (
                                    <tr key={need.id}>
                                        <td className="font-medium text-muted">#{need.id}</td>
                                        <td>{need.district}, {need.state}</td>
                                        <td>{need.category}</td>
                                        <td><Badge variant={need.urgency === 'HIGH' ? 'danger' : need.urgency === 'MEDIUM' ? 'warning' : 'success'}>{need.urgency}</Badge></td>
                                        <td>
                                            {!need.priority ? <span className="text-muted text-sm">Pending</span> : 
                                             <Badge variant={need.priority === 'HIGH' ? 'danger' : need.priority === 'MEDIUM' ? 'warning' : 'success'}>{need.priority}</Badge>}
                                        </td>
                                        <td><Badge variant="info">{need.status.replace(/_/g, ' ')}</Badge></td>
                                        <td style={{textAlign: 'right'}}>
                                            <Link to={`/csr-needs/${need.id}`}>
                                                <Button variant="secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Manage</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {needs.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                                            <div style={{ marginBottom: '1rem' }}>No CSR needs have been created yet.</div>
                                            <Link to="/csr-needs/create"><Button variant="primary">Create First Need</Button></Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default CSRNeeds;
