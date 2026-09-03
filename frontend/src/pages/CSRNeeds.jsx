import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCSRNeeds } from '../services/api';

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

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>CSR Needs</h1>
                <Link to="/csr-needs/create" className="btn-primary">
                    Create CSR Need
                </Link>
            </div>

            {loading && <div>Loading CSR Needs...</div>}
            {error && <div className="error-message">Error: {error}</div>}

            {!loading && !error && needs.length === 0 && (
                <div className="placeholder-page">No CSR Needs found. Create one.</div>
            )}

            {!loading && !error && needs.length > 0 && (
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {needs.map(need => (
                            <tr key={need.id}>
                                <td>#{need.id}</td>
                                <td>{need.category}</td>
                                <td>{need.location.city}, {need.location.state}</td>
                                <td>{need.beneficiary_count}</td>
                                <td><span className={`badge badge-${need.urgency.toLowerCase()}`}>{need.urgency}</span></td>
                                <td>
                                    {need.priority ? (
                                        <span className={`badge badge-${need.priority.toLowerCase()}`}>{need.priority}</span>
                                    ) : (
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Pending Assessment</span>
                                    )}
                                </td>
                                <td><span className="badge badge-status">{need.status.replace(/_/g, ' ')}</span></td>
                                <td>
                                    <Link to={`/csr-needs/${need.id}`} className="link-action">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CSRNeeds;
