import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCSRNeeds } from '../services/api';
import { PageHeader, LoadingState, ErrorState, StatusBadge, EmptyState } from '../components/UI';
import { Plus, FileText } from 'lucide-react';

const CSRNeeds = () => {
    const [needs, setNeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadNeeds() {
            try {
                const data = await fetchCSRNeeds();
                setNeeds(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadNeeds();
    }, []);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;

    return (
        <div className="animate-fade-in-up">
            <PageHeader 
                title="CSR Needs" 
                subtitle="Manage identified CSR requirements."
                action={
                    <Link to="/csr-needs/create" className="btn btn-primary">
                        <Plus size={16} /> Create CSR Need
                    </Link>
                }
            />

            {needs.length === 0 ? (
                <EmptyState 
                    title="No CSR needs yet" 
                    message="Create your first CSR need to get started." 
                    icon={FileText}
                    action={
                        <Link to="/csr-needs/create" className="btn btn-primary">
                            Create CSR Need
                        </Link>
                    }
                />
            ) : (
                <div className="card">
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Beneficiaries</th>
                                    <th>Urgency</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {needs.map(need => (
                                    <tr key={need.id}>
                                        <td className="text-muted">#{need.id}</td>
                                        <td style={{fontWeight: 500}}>{need.category}</td>
                                        <td>{need.location?.city || need.city_locality}, {need.location?.state || need.state}</td>
                                        <td className="text-muted">{need.beneficiary_count}</td>
                                        <td><StatusBadge status={need.urgency} type="priority" /></td>
                                        <td>
                                            {need.priority ? (
                                                <StatusBadge status={need.priority} type="priority" />
                                            ) : (
                                                <span className="text-muted">Pending</span>
                                            )}
                                        </td>
                                        <td><StatusBadge status={need.status.replace(/_/g, ' ')} /></td>
                                        <td>
                                            <Link to={`/csr-needs/${need.id}`} style={{color: 'var(--accent)', textDecoration: 'none', fontWeight: 500}}>View Details</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CSRNeeds;
