import React, { useEffect, useState } from 'react';
import { PageHeader, Card, CardHeader, CardBody, Badge, Button, LoadingState, ErrorState, Skeleton, SkeletonCard, StatusBadge, EmptyState } from '../components/UI';

import { Link } from 'react-router-dom';
import { fetchNGOs } from '../services/api';

const NGODiscovery = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sectorFilter, setSectorFilter] = useState('');

    const loadNGOs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchNGOs();
            setNgos(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch NGOs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadNGOs(); }, []);

    if (loading) return <div className="page-container"><LoadingState /></div>;
    if (error) return <div className="page-container animate-fade-in-up"><ErrorState message={error} onRetry={loadNGOs} /></div>;

    const filtered = ngos.filter(ngo => {
        const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) || (ngo.locations && ngo.locations.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesSector = sectorFilter ? (ngo.sectors && ngo.sectors.includes(sectorFilter)) : true;
        return matchesSearch && matchesSector;
    });

    return (
        <div className="page-container animate-fade-in-up">
            <PageHeader title="NGO Discovery" subtitle="Browse and filter registered NGO partners." />

            <Card className="mb-4">
                <CardHeader><h3 className="card-title">Search & Filters</h3></CardHeader>
                <CardBody style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <input 
                            type="text" 
                            placeholder="Search by name or location..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <select 
                            value={sectorFilter}
                            onChange={e => setSectorFilter(e.target.value)}
                            className="form-control"
                        >
                            <option value="">All Sectors</option>
                            <option value="Education">Education</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Environment">Environment</option>
                            <option value="Livelihood">Livelihood</option>
                        </select>
                    </div>
                </CardBody>
            </Card>

            <div className="grid-3 mt-4">
                {filtered.map(ngo => (
                    <Card key={ngo.id} className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column" }}>
                        <CardBody className="h-100" style={{ display: "flex", flexDirection: "column" }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{ngo.name}</h3>
                            <p className="text-muted text-sm" style={{ marginBottom: '1rem', flex: 1 }}>{ngo.description || 'No description provided.'}</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Sector:</span> 
                                    <span className="text-muted">{ngo.sectors || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Region:</span> 
                                    <span className="text-muted">{ngo.locations || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Exp:</span> 
                                    <span className="text-muted">{ngo.experience || 'N/A'}</span>
                                </div>
                            </div>
                            
                            <Link to={`/ngos/${ngo.id}`} style={{textDecoration: 'none'}}>
                                <Button variant="secondary" style={{width: "100%"}}>View Profile</Button>
                            </Link>
                        </CardBody>
                    </Card>
                ))}
                {filtered.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No NGOs found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};
export default NGODiscovery;
