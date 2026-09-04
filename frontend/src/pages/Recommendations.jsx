import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, LoadingState, ErrorState, Button } from '../components/UI';
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Building, MapPin, Tag } from 'lucide-react';
import { getGlobalRecommendations } from '../services/api';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await getGlobalRecommendations();
                setRecommendations(data);
            } catch(e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <LoadingState text="Loading recommendations..." />;
    if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

    return (
        <div>
            <PageHeader 
                title="Recommendations" 
                subtitle="Explainable NGO recommendations for identified CSR needs."
                icon={Sparkles}
            />

            {recommendations.length === 0 ? (
                <div style={{textAlign: 'center', padding: '4rem 1rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)'}}>
                    <Sparkles size={48} color="var(--text-secondary)" style={{marginBottom: '1rem', opacity: 0.5}} />
                    <h3 style={{marginBottom: '0.5rem', color: 'var(--text-primary)'}}>No recommendations yet</h3>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>Complete NGO matching for a CSR need to generate explainable recommendations.</p>
                    <Link to="/csr-needs"><Button>View CSR Needs</Button></Link>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    {recommendations.map(rec => (
                        <div key={rec.id} className="card" style={{display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1rem'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '1rem'}}>
                                <div>
                                    <h3 style={{margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)'}}>
                                        <Building size={20} /> {rec.ngo_name} 
                                        <span style={{fontSize: '0.875rem', padding: '0.2rem 0.6rem', background: 'var(--background)', color: 'var(--text-secondary)', borderRadius: '9999px', border: '1px solid var(--border)', marginLeft: '0.5rem'}}>{rec.match_score.toFixed(1)}% Match</span>
                                    </h3>
                                    <Link to={/csr-needs/} style={{textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                        CSR Need #{rec.csr_need_id} <ArrowRight size={14} />
                                    </Link>
                                    <div style={{display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
                                        <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Tag size={14} /> {rec.csr_need_category}</span>
                                        <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><MapPin size={14} /> {rec.csr_need_location}</span>
                                        <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>Status: {rec.csr_need_status.replace(/_/g, ' ')}</span>
                                    </div>
                                </div>
                                <Link to={/ngos/}><Button variant="secondary" size="sm">View NGO</Button></Link>
                            </div>
                            
                            <div>
                                <p style={{margin: '0 0 1rem 0', color: 'var(--text-primary)', lineHeight: 1.6}}>{rec.explanation.summary}</p>
                                
                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                                    <div>
                                        <h4 style={{fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle2 size={16} color="#10B981" /> Strengths</h4>
                                        <ul style={{margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
                                            {rec.explanation.strengths.map((str, j) => <li key={j}>{str}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 style={{fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertTriangle size={16} color="#F59E0B" /> Considerations</h4>
                                        <ul style={{margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
                                            {rec.explanation.considerations.map((con, j) => <li key={j}>{con}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                
                                <div style={{marginTop: '1.5rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent)'}}>
                                    <strong>AI Confidence Note:</strong> {rec.explanation.confidence_note}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recommendations;