import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchNGOs } from '../services/api';
import { PageHeader, LoadingState, ErrorState, Button } from '../components/UI';
import { Search } from 'lucide-react';

const NGODiscovery = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const currentSearch = searchParams.get('search') || '';
    const currentSector = searchParams.get('sector') || '';
    const currentLocation = searchParams.get('location') || '';
    const currentBeneficiary = searchParams.get('beneficiary_type') || '';

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const query = {};
                if (currentSearch) query.search = currentSearch;
                if (currentSector) query.sector = currentSector;
                if (currentLocation) query.location = currentLocation;
                if (currentBeneficiary) query.beneficiary_type = currentBeneficiary;

                const data = await fetchNGOs(query);
                setNgos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [currentSearch, currentSector, currentLocation, currentBeneficiary]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(name, value);
        } else {
            newParams.delete(name);
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams(new URLSearchParams());
    };

    return (
        <div className="animate-fade-in-up" style={{maxWidth: '1200px'}}>
            <PageHeader 
                title="NGO Discovery" 
                subtitle="Find NGOs based on sector, location and beneficiary needs."
            />

            <div className="card mb-4" style={{ backgroundColor: 'var(--background)' }}>
                <div className="card-body">
                    <div className="form-grid" style={{ alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label text-muted">Search NGOs...</label>
                            <input type="text" name="search" className="form-control" value={currentSearch} onChange={handleFilterChange} placeholder="Enter NGO name..." />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label text-muted">Sector</label>
                            <select name="sector" className="form-control" value={currentSector} onChange={handleFilterChange}>
                                <option value="">All Sectors</option>
                                <option value="Education">Education</option>
                                <option value="Environment">Environment</option>
                                <option value="Healthcare">Healthcare</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label text-muted">Location</label>
                            <input type="text" name="location" className="form-control" value={currentLocation} onChange={handleFilterChange} placeholder="e.g. Chennai" />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label text-muted">Beneficiary Type</label>
                            <select name="beneficiary_type" className="form-control" value={currentBeneficiary} onChange={handleFilterChange}>
                                <option value="">All Types</option>
                                <option value="Children">Children</option>
                                <option value="Elderly">Elderly</option>
                                <option value="Women">Women</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
                    </div>
                </div>
            </div>

            {loading ? <LoadingState /> : error ? <ErrorState message={error} /> : (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem'}}>
                    {ngos.length === 0 ? (
                        <div style={{gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'}}>
                            <Search color="var(--border)" size={48} style={{margin: '0 auto 1rem'}} />
                            <h3 style={{marginBottom: '0.5rem'}}>No NGOs found</h3>
                            <p className="text-muted">Try adjusting your filters.</p>
                        </div>
                    ) : (
                        ngos.map(ngo => (
                            <div key={ngo.id} className="card" style={{display: 'flex', flexDirection: 'column'}}>
                                <div className="card-header">
                                    <h3 className="card-title" style={{margin: 0, fontSize: '1.125rem'}}>{ngo.name}</h3>
                                </div>
                                <div className="card-body" style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                                    <p className="text-muted" style={{fontSize: '0.875rem', marginBottom: '1rem', flex: 1}}>{ngo.description}</p>
                                    <div style={{fontSize: '0.75rem', marginBottom: '1rem'}}>
                                        <div style={{marginBottom: '0.25rem'}}><strong style={{color: 'var(--primary)'}}>Sectors:</strong> {ngo.sectors.replace(/\|/g, ', ')}</div>
                                        <div style={{marginBottom: '0.25rem'}}><strong style={{color: 'var(--primary)'}}>Locations:</strong> {ngo.locations.replace(/\|/g, ', ')}</div>
                                        <div><strong style={{color: 'var(--primary)'}}>Beneficiaries:</strong> {ngo.beneficiary_types.replace(/\|/g, ', ')}</div>
                                    </div>
                                    <Link to={`/ngos/${ngo.id}`} className="btn btn-secondary" style={{width: '100%'}}>View NGO</Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NGODiscovery;
