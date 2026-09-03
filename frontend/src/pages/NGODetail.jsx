import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchNGO, fetchCSRProjects } from '../services/api';

const NGODetail = () => {
    const { id } = useParams();
    const [ngo, setNgo] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                const ngoData = await fetchNGO(id);
                setNgo(ngoData);

                const projectsData = await fetchCSRProjects(id);
                setProjects(projectsData);
            } catch (err) {
                setError(err.message || 'Unable to load NGO details.');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    if (loading) return <div>Loading NGO Details...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!ngo) return <div className="error-message">NGO not found.</div>;

    return (
        <div className="detail-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>NGO Details</h1>
                <Link to="/ngo-discovery" className="btn-secondary">Back to Discovery</Link>
            </div>

            <div className="detail-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>{ngo.name}</h2>
                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{ngo.description}</p>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Sectors</span>
                    <span className="detail-value">{ngo.sectors}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Locations</span>
                    <span className="detail-value">{ngo.locations}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Beneficiary Types</span>
                    <span className="detail-value">{ngo.beneficiaries}</span>
                </div>
                <div className="detail-row" style={{ alignItems: 'flex-start', borderBottom: 'none' }}>
                    <span className="detail-label">Experience</span>
                    <p className="detail-value" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{ngo.experience}</p>
                </div>
            </div>

            {projects.length > 0 && (
                <div className="detail-card">
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Related CSR Projects</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {projects.map(p => (
                            <div key={p.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{p.company}</h3>
                                    <span className="badge badge-status">{p.category}</span>
                                </div>
                                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Location: {p.location} • Year: {p.year}</p>
                                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>{p.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NGODetail;
