import React, { useEffect, useState } from 'react';
import { PageHeader, Card, CardHeader, CardBody, Badge, Button, LoadingState, ErrorState, Skeleton, SkeletonCard, StatusBadge, EmptyState } from '../components/UI';

import { useParams, Link } from 'react-router-dom';
import { fetchCSRNeed, analyzeCSRNeed, assessCSRNeedPriority, generateMatches, getMatches, generateRecommendations, getRecommendations, getStatusHistory } from '../services/api';

import { Sparkles, Calculator } from 'lucide-react';

const CSRNeedDetail = () => {
    const { id } = useParams();
    const [need, setNeed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAssessing, setIsAssessing] = useState(false);
    const [matches, setMatches] = useState([]);
    const [isMatching, setIsMatching] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [isExplaining, setIsExplaining] = useState(false);
    const [statusHistory, setStatusHistory] = useState([]);


    useEffect(() => {

        async function load() {
            try {
                const data = await fetchCSRNeed(id);
                setNeed(data);

                const matchesData = await getMatches(id);
                if (matchesData && matchesData.matches) {
                    setMatches(matchesData.matches);
                }

                const recsData = await getRecommendations(id);
                if (recsData && recsData.recommendations) {
                    setRecommendations(recsData.recommendations);
                }
                const historyData = await getStatusHistory(id);
                setStatusHistory(historyData);


            } catch (err) {

                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            await analyzeCSRNeed(id);
            const updated = await fetchCSRNeed(id);
            setNeed(updated);
            const updatedHistory = await getStatusHistory(id);
            setStatusHistory(updatedHistory);
        } catch (err) {
            alert('Analysis failed: ' + err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };



    const handleGenerateExplanations = async () => {
        setIsExplaining(true);
        try {
            const data = await generateRecommendations(id);
            setRecommendations(data.recommendations);
        } catch (err) {
            console.error(err);
            alert("Failed to generate recommendation explanations.");
        } finally {
            setIsExplaining(false);
        }
    };

    const handleGenerateMatches = async () => {
        setIsMatching(true);
        try {
            const data = await generateMatches(id);
            setMatches(data.matches);
            
            const updated = await fetchCSRNeed(id);
            setNeed(updated);
            const updatedHistory = await getStatusHistory(id);
            setStatusHistory(updatedHistory);

        } catch (err) {
            console.error(err);
            alert("Failed to generate NGO matches.");
        } finally {
            setIsMatching(false);
        }
    };

    const handleAssessPriority = async () => {
        setIsAssessing(true);
        try {
            await assessCSRNeedPriority(id);
            const updated = await fetchCSRNeed(id);
            setNeed(updated);
            const updatedHistory = await getStatusHistory(id);
            setStatusHistory(updatedHistory);
        } catch (err) {
            alert('Priority assessment failed: ' + err.message);
        } finally {
            setIsAssessing(false);
        }
    };

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!need) return <ErrorState message="CSR Need not found" />;

    const loc = need.location || { state: need.state, district: need.district, city: need.city_locality };
    
    const renderTimeline = () => {
        const statuses = ['NEED_IDENTIFIED', 'AI_ASSESSMENT', 'PRIORITIZED', 'MATCHED', 'RECOMMENDED'];
        const currentIndex = statuses.indexOf(need.status);
        
        return (
            <Card className="animate-fade-in-up mb-4">
                <CardHeader><h3 className="card-title">Status Tracking</h3></CardHeader>
                <CardBody>
                    <div className="timeline-container">
                        <div className="timeline-track"></div>
                        <div className="timeline-progress" style={{ width: `${Math.max(0, (currentIndex / (statuses.length - 1)) * 100)}%` }}></div>
                        {statuses.map((s, idx) => {
                            const isCompleted = idx < currentIndex;
                            const isActive = idx === currentIndex;
                            return (
                                <div key={s} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-label">{s.replace(/_/g, ' ')}</div>
                                </div>
                            );
                        })}
                    </div>
                </CardBody>
            </Card>
        );
    };

    const getScoreVariant = (score) => {
        if(score >= 80) return 'success';
        if(score >= 50) return 'warning';
        return 'neutral';
    };

    return (
        <div className="page-container animate-fade-in-up">
            <PageHeader 
                title={`CSR Requirement #${need.id}`} 
                subtitle={`${loc.city || '-'}, ${loc.district || '-'} � Created ${new Date(need.created_at).toLocaleDateString()}`}
                action={<Badge variant={need.status === 'RECOMMENDED' ? 'success' : 'info'} className="text-sm px-3 py-1">{need.status.replace(/_/g, ' ')}</Badge>}
            />

            {renderTimeline()}

             <div className="grid-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card>
                        <CardHeader><h3 className="card-title">CSR Need Overview</h3></CardHeader>
                        <CardBody>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <span className="text-muted text-sm font-semibold mb-1" style={{ display: 'block', textTransform: 'uppercase' }}>Description</span>
                                    <p>{need.description}</p>
                                </div>
                                <div className="grid-2 mt-2">
                                    <div>
                                        <span className="text-muted text-sm font-semibold mb-1" style={{ display: 'block', textTransform: 'uppercase' }}>Category</span>
                                        <div className="font-medium">{need.category}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted text-sm font-semibold mb-1" style={{ display: 'block', textTransform: 'uppercase' }}>Urgency</span>
                                        <Badge variant={need.urgency === 'HIGH' ? 'danger' : need.urgency === 'MEDIUM' ? 'warning' : 'success'}>{need.urgency}</Badge>
                                    </div>
                                    <div>
                                        <span className="text-muted text-sm font-semibold mb-1" style={{ display: 'block', textTransform: 'uppercase' }}>Beneficiaries</span>
                                        <div className="font-medium">{need.beneficiary_type} ({need.beneficiary_count})</div>
                                    </div>
                                    <div>
                                        <span className="text-muted text-sm font-semibold mb-1" style={{ display: 'block', textTransform: 'uppercase' }}>Location</span>
                                        <div className="font-medium">{loc.state}</div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
                                AI Analysis
                            </h3>
                            {!need.ai_analysis && <Button variant="secondary" onClick={handleAssess} disabled={assessing}>{assessing ? 'Analyzing...' : 'Run AI Analysis'}</Button>}
                        </CardHeader>
                        <CardBody>
                            {need.ai_analysis ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ background: 'var(--primary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                        <span className="text-sm font-semibold mb-1" style={{ display: 'block', color: 'var(--primary)' }}>Summary</span>
                                        <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{need.ai_analysis.summary}</div>
                                    </div>
                                    <div className="grid-2 pt-2">
                                        <div><span className="text-muted text-sm" style={{display:'block'}}>Key Need</span><div className="font-medium">{need.ai_analysis.key_need}</div></div>
                                        <div><span className="text-muted text-sm" style={{display:'block'}}>Intervention</span><div className="font-medium">{need.ai_analysis.required_intervention}</div></div>
                                        <div><span className="text-muted text-sm" style={{display:'block'}}>Identified Category</span><div className="font-medium">{need.ai_analysis.identified_category}</div></div>
                                        <div><span className="text-muted text-sm" style={{display:'block'}}>Beneficiary Group</span><div className="font-medium">{need.ai_analysis.beneficiary_group}</div></div>
                                    </div>
                                    <div className="mt-2 text-muted text-sm">{need.ai_analysis.analysis}</div>
                                </div>
                            ) : (
                                <div className="text-center text-muted" style={{ padding: '2rem 1rem' }}>
                                    AI Assessment has not been run yet. Run the Analysis to extract structured data from this requirement.
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card>
                        <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title">Priority Assessment</h3>
                            {!need.priority && <Button variant="secondary" onClick={handlePrioritize} disabled={prioritizing || !need.ai_analysis}>{prioritizing ? 'Prioritizing...' : 'Calculate Priority'}</Button>}
                        </CardHeader>
                        <CardBody>
                            {need.priority ? (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                                    <div style={{ padding: '1rem', background: need.priority === 'HIGH' ? 'var(--danger-bg)' : need.priority === 'MEDIUM' ? 'var(--warning-bg)' : 'var(--success-bg)', borderRadius: 'var(--radius-md)', border: `1px solid ${need.priority === 'HIGH' ? 'var(--danger)' : need.priority === 'MEDIUM' ? '#d97706' : 'var(--success)'}`, minWidth: '100px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 700, color: need.priority === 'HIGH' ? 'var(--danger)' : need.priority === 'MEDIUM' ? '#d97706' : 'var(--success)' }}>{need.priority_score || 0}</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>SCORE</div>
                                    </div>
                                    <div>
                                        <Badge variant={need.priority === 'HIGH' ? 'danger' : need.priority === 'MEDIUM' ? 'warning' : 'success'} style={{ marginBottom: '0.5rem' }}>{need.priority} PRIORITY</Badge>
                                        <div className="text-sm text-muted">{need.priority_reason}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted" style={{ padding: '2rem 1rem' }}>
                                    Priority has not been assigned. Run AI Analysis first, then determine priority.
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title">Top NGO Matches</h3>
                            {(!matches || matches.length === 0) && (
                                <Button variant="primary" onClick={handleMatch} disabled={matching || !need.priority}>{matching ? 'Finding Partners...' : 'Find Matches'}</Button>
                            )}
                        </CardHeader>
                        <CardBody>
                            {matches && matches.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {matches.slice(0,3).map((match, idx) => (
                                        <div key={match.id || match.ngo_id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '1.2rem' }}>{idx === 0 ? '1️⃣' : idx === 1 ? '2️⃣' : '3️⃣'}</span>
                                                    <span style={{ fontWeight: 600 }}>{match.ngo_name}</span>
                                                </div>
                                                <Badge variant={getScoreVariant(match.match_score)}>{Math.round(match.match_score)}% Match</Badge>
                                            </div>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                                {[
                                                    {label: 'Sector (35%)', val: match.sector_score ?? match.sector_match},
                                                    {label: 'Location (30%)', val: match.location_score ?? match.location_match},
                                                    {label: 'Beneficiary (20%)', val: match.beneficiary_score ?? match.beneficiary_match},
                                                    {label: 'Exp (15%)', val: match.experience_score ?? match.experience_match}
                                                ].map(s => (
                                                    <div key={s.label}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                                                            <span>{s.label}</span><span>{Math.round(s.val || 0)}/100</span>
                                                        </div>
                                                        <div className="score-track" style={{ height: '4px' }}>
                                                            <div className="score-fill" style={{ width: `${s.val || 0}%`, backgroundColor: s.val > 70 ? 'var(--success)' : s.val > 40 ? '#d97706' : 'var(--text-tertiary)' }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <Link to={`/ngos/${match.ngo_id}`}><Button variant="secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem'}}>View Profile</Button></Link>
                                            </div>
                                        </div>
                                    ))}
                                    {matches.length > 3 && (
                                        <div className="text-center mt-2">
                                            <span className="text-muted text-sm">+ {matches.length - 3} other valid matches identified</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-muted" style={{ padding: '1rem' }}>
                                    No matches found.
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default CSRNeedDetail;
