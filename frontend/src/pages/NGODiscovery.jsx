import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNGOs } from '../services/api';

const SECTORS = [
    'Education', 'Healthcare', 'Environment', 'Livelihood', 'Community Development', 'Sanitation', 'Women Empowerment'
];

const BENEFICIARY_TYPES = [
    'Students', 'Children', 'Women', 'Farmers', 'Patients', 'Youth', 'Community', 'Elderly'
];

const NGODiscovery = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState('');
    const [sector, setSector] = useState('');
    const [location, setLocation] = useState('');
    const [beneficiaryType, setBeneficiaryType] = useState('');

    const loadNGOs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchNGOs(search, sector, location, beneficiaryType);
            setNgos(data);
        } catch (err) {
            setError(err.message || 'Unable to load NGOs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load initially and when filters change
    useEffect(() => {
        const timer = setTimeout(() => {
            loadNGOs();
        }, 300); // debounce search

        return () => clearTimeout(timer);
    }, [search, sector, location, beneficiaryType]);

    const handleClear = () => {
        setSearch('');
        setSector('');
        setLocation('');
        setBeneficiaryType('');
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>NGO Discovery</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Discover NGOs based on CSR sector, location and beneficiary needs.</p>
            </div>

            <div className="detail-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: '1 1 200px' }}>
                    <label className="form-label">Search</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search NGOs..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ flex: '1 1 150px' }}>
                    <label className="form-label">Sector</label>
                    <select className="form-input" value={sector} onChange={e => setSector(e.target.value)}>
                        <option value="">All Sectors</option>
                        {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div style={{ flex: '1 1 150px' }}>
                    <label className="form-label">Location (City)</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Chennai"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                    />
                </div>
                <div style={{ flex: '1 1 150px' }}>
                    <label className="form-label">Beneficiary Type</label>
                    <select className="form-input" value={beneficiaryType} onChange={e => setBeneficiaryType(e.target.value)}>
                        <option value="">All Types</option>
                        {BENEFICIARY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <div style={{ flex: '0 0 auto', alignSelf: 'flex-end', paddingBottom: '2px' }}>
                    <button className="btn-secondary" onClick={handleClear}>Clear Filters</button>
                </div>
            </div>

            {loading && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && ngos.length === 0 && (
                <div className="placeholder-page" style={{ padding: '4rem', textAlign: 'center' }}>
                    <h3>No NGOs found</h3>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Try changing your search or filters.</p>
                </div>
            )}

            {!loading && !error && ngos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {ngos.map(ngo => (
                        <div key={ngo.id} className="detail-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>{ngo.name}</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>
                                {ngo.description.length > 120 ? ngo.description.substring(0, 120) + '...' : ngo.description}
                            </p>

                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <strong>Sectors:</strong> {ngo.sectors.split(',').join(' • ')}
                            </div>
                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <strong>Locations:</strong> {ngo.locations.split(',').join(' • ')}
                            </div>
                            <div style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                <strong>Beneficiaries:</strong> {ngo.beneficiaries.split(',').join(' • ')}
                            </div>

                            <Link to={`/ngos/${ngo.id}`} className="btn-primary" style={{ textAlign: 'center' }}>
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NGODiscovery;
