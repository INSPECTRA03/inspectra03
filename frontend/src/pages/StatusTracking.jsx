import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, LoadingState, ErrorState, StatusBadge } from '../components/UI';
import { Activity, Users, MapPin, Tag } from 'lucide-react';
import { fetchCSRNeeds } from '../services/api';

const LIFECYCLE_STAGES = [
    { id: 'NEED_IDENTIFIED', label: 'Need Identified' },
    { id: 'AI_ASSESSMENT', label: 'AI Assessment' },
    { id: 'PRIORITIZED', label: 'Prioritized' },
    { id: 'MATCHED', label: 'Matched' },
    { id: 'RECOMMENDED', label: 'Recommended' }
];

const StatusTracking = () => {
    const [needs, setNeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchCSRNeeds();
                setNeeds(data || []);
            } catch(e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);
    
    if (loading) return <LoadingState text="Loading status board..." />;
    if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

    return (
        <div className="animate-fade-in-up" style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <PageHeader 
                title="CSR Status Tracking" 
                subtitle="Monitor the lifecycle progression of CSR needs."
                icon={Activity}
            />
            
            <div style={{flex: 1, overflowX: 'auto', paddingBottom: '1rem'}}>
                <div style={{display: 'flex', gap: '1.5rem', minWidth: 'max-content', height: '100%'}}>
                    {LIFECYCLE_STAGES.map(stage => {
                        const stageNeeds = needs.filter(n => n.status === stage.id);
                        return (
                            <div key={stage.id} className="animate-fade-in-up" style={{width: '320px', display: 'flex', flexDirection: 'column', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', animationDelay: `${LIFECYCLE_STAGES.indexOf(stage) * 0.1}s`}}>
                                <div style={{padding: '1rem', borderBottom: '1px solid var(--border)', background: 'var(--background)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <h3 style={{margin: 0, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{stage.label}</h3>
                                    <span style={{background: 'var(--surface)', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border)'}}>
                                        {stageNeeds.length}
                                    </span>
                                </div>
                                <div style={{padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', minHeight: '200px'}}>
                                    {stageNeeds.length === 0 ? (
                                        <div style={{textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
                                            No CSR needs in this stage.
                                        </div>
                                    ) : (
                                        stageNeeds.map(need => (
                                            <Link key={need.id} to={`/csr-needs/${need.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                                                <div className="card" style={{padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', transition: 'border-color 0.2s', cursor: 'pointer'}} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                                        <span style={{fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem'}}>Need #{need.id}</span>
                                                        {need.priority && <StatusBadge status={need.priority} />}
                                                    </div>
                                                    <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem'}}>
                                                        <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Tag size={12} /> {need.ai_identified_category || need.category || 'Uncategorized'}</span>
                                                        <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><MapPin size={12} /> {need.location ? `${need.location.city}, ${need.location.state}` : "Unknown"}</span>
                                                        <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Users size={12} /> {need.beneficiary_count} beneficiaries</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StatusTracking;
