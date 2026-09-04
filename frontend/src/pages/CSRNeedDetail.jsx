import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCSRNeed, analyzeCSRNeed, assessCSRNeedPriority, generateMatches, getMatches, generateRecommendations, getRecommendations, getStatusHistory } from '../services/api';
import { PageHeader, StatusBadge, Button, LoadingState, ErrorState } from '../components/UI';
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

    return (
        <div style={{maxWidth: '900px'}}>
            <PageHeader 
                title={`CSR Need #${need.id}`}
                subtitle="Detailed view of the community requirement."
                action={<StatusBadge status={need.status.replace(/_/g, ' ')} />}
            />

            <div className="card mb-4 animate-fade-in-up">
                <div className="card-header"><h3 className="card-title" style={{margin: 0}}>CSR Need Overview</h3></div>
                <div className="card-body">
                    <div className="form-grid mb-4">
                        <div><span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Category</span><strong>{need.category}</strong></div>
                        <div><span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Location</span><strong>{loc.city}, {loc.state}</strong></div>
                        <div><span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Beneficiaries</span><strong>{need.beneficiary_count} ({need.beneficiary_type})</strong></div>
                        <div><span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Urgency</span><StatusBadge status={need.urgency} type="priority" /></div>
                        <div>
                            <span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Priority</span>
                            {need.priority ? <StatusBadge status={need.priority} type="priority" /> : <span className="text-muted">Pending</span>}
                        </div>
                    </div>
                    <div>
                        <span className="text-muted" style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Need Description</span>
                        <p style={{whiteSpace: 'pre-wrap', margin: 0}}>{need.description}</p>
                    </div>
                </div>
            </div>

            <div className="card mb-4 animate-fade-in-up">
                <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 className="card-title" style={{margin: 0}}>AI CSR Analysis</h3>
                    {!need.ai_analysis && (
                        <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                            <Sparkles size={16} /> {isAnalyzing ? 'Analyzing CSR need...' : 'Analyze with AI'}
                        </Button>
                    )}
                </div>
                {need.ai_analysis ? (
                    <div className="card-body animate-fade-in">
                        <div className="form-grid mb-4">
                            <div><span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Identified Category</span><strong>{need.ai_analysis.identified_category || 'N/A'}</strong></div>
                            <div><span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Beneficiary Group</span><strong>{need.ai_analysis.beneficiary_group || 'N/A'}</strong></div>
                            <div><span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Required Intervention</span><strong>{need.ai_analysis.required_intervention || 'N/A'}</strong></div>
                            <div><span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Key Need</span><strong>{need.ai_analysis.key_need || 'N/A'}</strong></div>
                        </div>
                        <div className="mb-4">
                            <span className="text-muted" style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Summary</span>
                            <p style={{margin: 0}}>{need.ai_analysis.summary || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-muted" style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Full Analysis</span>
                            <div style={{padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', whiteSpace: 'pre-wrap'}}>
                                {need.ai_analysis.analysis || ''}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card-body text-center" style={{padding: '3rem 1rem', color: 'var(--text-secondary)'}}>
                        {isAnalyzing ? 'Running AI analysis...' : 'No AI analysis generated yet.'}
                    </div>
                )}
            </div>

            <div className="card mb-4 animate-fade-in-up">
                <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 className="card-title" style={{margin: 0}}>Priority Assessment</h3>
                    {need.ai_analysis && !need.priority && (
                        <Button onClick={handleAssessPriority} disabled={isAssessing} variant="secondary">
                            <Calculator size={16} /> {isAssessing ? 'Assessing...' : 'Assess Priority'}
                        </Button>
                    )}
                </div>
                {need.priority ? (
                    <div className="card-body animate-fade-in">
                        <div className="form-grid">
                            <div>
                                <span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Priority</span>
                                <StatusBadge status={need.priority} type="priority" />
                            </div>
                            <div>
                                <span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Score</span>
                                <strong>{need.priority_score} / 100</strong>
                            </div>
                            <div style={{gridColumn: '1 / -1'}}>
                                <span className="text-muted" style={{display: 'block', fontSize: '0.875rem'}}>Reason</span>
                                <p style={{margin: 0}}>{need.priority_reason}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card-body text-center" style={{padding: '3rem 1rem', color: 'var(--text-secondary)'}}>
                        {!need.ai_analysis ? 'Complete AI analysis first to unlock priority assessment.' : 'Ready for priority assessment.'}
                    </div>
                )}
            </div>

            {/* NGO Matches Section */}
            <div className="card mb-4 animate-fade-in-up">
                <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 className="card-title" style={{margin: 0}}>Recommended NGO Matches</h3>
                    {need.priority && (
                        <Button onClick={handleGenerateMatches} disabled={isMatching}>
                            {isMatching ? 'Generating Matches...' : (matches.length > 0 ? 'Regenerate Matches' : 'Generate Matches')}
                        </Button>
                    )}
                </div>
                
                <div className="card-body" style={{padding: 0}}>
                    {isMatching ? (
                        <div className="text-center" style={{padding: '3rem 1rem'}}>
                            <div className="loading-spinner"></div>
                            <p style={{marginTop: '1rem', color: 'var(--text-secondary)'}}>Running matching engine...</p>
                        </div>
                    ) : matches.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
                            {matches.map((match) => {
                                // Extract correct fields from backend MatchResponse
                                const sScore = match.sector_score ?? match.sector_match ?? 0;
                                const lScore = match.location_score ?? match.location_match ?? 0;
                                const bScore = match.beneficiary_score ?? match.beneficiary_match ?? 0;
                                const eScore = match.experience_score ?? match.experience_match ?? 0;

                                return (
                                    <div key={match.ngo_id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', backgroundColor: 'var(--surface)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--accent)' }}>
                                                    {match.ngo_name}
                                                </h4>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                                                        {match.match_score.toFixed(1)}% <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Overall Match Score</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                        Based on: Sector 35% &middot; Location 30% &middot; Beneficiary 20% &middot; Experience 15%
                                                    </div>
                                                </div>
                                            </div>
                                            <Link to={`/ngos/${match.ngo_id}`} className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                                                View NGO
                                            </Link>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <h5 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)', fontSize: '0.875rem' }}>Matching Breakdown</h5>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Weight: 100%</div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                            {/* Sector Match */}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Sector Match</strong>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                    <span>35% weight</span>
                                                    <span>{sScore.toFixed(0)}% score</span>
                                                </div>
                                                <div style={{ height: '8px', backgroundColor: 'var(--background)', borderRadius: '9999px', overflow: 'hidden' }}>
                                                    <div className="animate-progress" style={{ height: '100%', width: `${sScore}%`, backgroundColor: 'var(--accent)' }}></div>
                                                </div>
                                            </div>

                                            {/* Location Match */}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Location Match</strong>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                    <span>30% weight</span>
                                                    <span>{lScore.toFixed(0)}% score</span>
                                                </div>
                                                <div style={{ height: '8px', backgroundColor: 'var(--background)', borderRadius: '9999px', overflow: 'hidden' }}>
                                                    <div className="animate-progress" style={{ height: '100%', width: `${lScore}%`, backgroundColor: 'var(--accent)' }}></div>
                                                </div>
                                            </div>

                                            {/* Beneficiary Match */}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Beneficiary Match</strong>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                    <span>20% weight</span>
                                                    <span>{bScore.toFixed(0)}% score</span>
                                                </div>
                                                <div style={{ height: '8px', backgroundColor: 'var(--background)', borderRadius: '9999px', overflow: 'hidden' }}>
                                                    <div className="animate-progress" style={{ height: '100%', width: `${bScore}%`, backgroundColor: 'var(--accent)' }}></div>
                                                </div>
                                            </div>

                                            {/* Experience Match */}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Experience Match</strong>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                    <span>15% weight</span>
                                                    <span>{eScore.toFixed(0)}% score</span>
                                                </div>
                                                <div style={{ height: '8px', backgroundColor: 'var(--background)', borderRadius: '9999px', overflow: 'hidden' }}>
                                                    <div className="animate-progress" style={{ height: '100%', width: `${eScore}%`, backgroundColor: 'var(--accent)' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center" style={{padding: '3rem 1rem', color: 'var(--text-secondary)'}}>
                            {!need.priority ? 'Complete priority assessment first.' : 'No NGO matches found. Click "Generate Matches" to find partners.'}
                        </div>
                    )}
                </div>
            </div>

            {/* Explainable Recommendations Section */}
            <div className="card mb-4 animate-fade-in-up">
                <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 className="card-title" style={{margin: 0}}>Explainable Recommendations</h3>
                    {matches.length > 0 && (
                        <Button onClick={handleGenerateExplanations} disabled={isExplaining}>
                            {isExplaining ? 'Generating Explanations...' : (recommendations.length > 0 ? 'Regenerate Explanations' : 'Generate Explanations')}
                        </Button>
                    )}
                </div>
                
                <div className="card-body">
                    {isExplaining ? (
                        <div className="text-center" style={{padding: '2rem', color: 'var(--text-secondary)'}}>
                            <p>Analyzing NGO matches and extracting factual evidence...</p>
                            <div className="loading-spinner" style={{marginTop: '1rem'}}></div>
                        </div>
                    ) : recommendations.length > 0 ? (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                            {recommendations.map((rec, idx) => (
                                <div key={idx} style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', backgroundColor: 'var(--background)'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                                        <h4 style={{margin: 0, color: 'var(--accent)'}}>{rec.ngo_name}</h4>
                                        <div style={{fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                            Match Score: 
                                            <StatusBadge status={rec.match_score >= 80 ? 'HIGH' : rec.match_score >= 50 ? 'MEDIUM' : 'LOW'} type="priority" />
                                            {rec.match_score}%
                                        </div>
                                    </div>
                                    
                                    <p style={{fontWeight: 500, marginBottom: '1rem'}}>{rec.explanation.summary}</p>
                                    
                                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1rem'}}>
                                        <div>
                                            <strong style={{color: 'var(--text-secondary)'}}>Why this NGO?</strong>
                                            <ul style={{marginTop: '0.5rem', paddingLeft: '1.25rem'}}>
                                                {rec.explanation.why_match && rec.explanation.why_match.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <strong style={{color: 'var(--text-secondary)'}}>Strengths</strong>
                                            <ul style={{marginTop: '0.5rem', paddingLeft: '1.25rem', color: 'var(--success)'}}>
                                                {rec.explanation.strengths && rec.explanation.strengths.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <strong style={{color: 'var(--text-secondary)'}}>Considerations</strong>
                                            <ul style={{marginTop: '0.5rem', paddingLeft: '1.25rem', color: 'var(--warning)'}}>
                                                {rec.explanation.considerations && rec.explanation.considerations.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontStyle: 'italic'}}>
                                        {rec.explanation.confidence_note}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center" style={{padding: '3rem 1rem', color: 'var(--text-secondary)'}}>
                            {!matches.length ? 'Generate NGO Matches first to unlock Explainable Recommendations.' : 'No explanations generated yet. Click "Generate Explanations" to run the intelligent AI explainer against these matches.'}
                        </div>
                    )}
                </div>
            </div>

            {/* Status History Timeline Section */}
            <div className="card mb-4 animate-fade-in-up">
                <div className="card-header">
                    <h3 className="card-title" style={{margin: 0}}>CSR Status Timeline</h3>
                </div>
                <div className="card-body">
                    {statusHistory.length > 0 ? (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--border)', marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem'}}>
                            {statusHistory.map((hist, idx) => (
                                <div key={idx} className="animate-fade-in-up" style={{position: 'relative', animationDelay: `${idx * 0.15}s`}}>
                                    <div style={{
                                        position: 'absolute', 
                                        left: '-1.85rem', 
                                        top: '0.2rem',
                                        width: '12px', 
                                        height: '12px', 
                                        borderRadius: '50%', 
                                        backgroundColor: idx === statusHistory.length - 1 ? 'var(--accent)' : 'var(--text-secondary)',
                                        border: '2px solid var(--surface)'
                                    }}></div>
                                    <div style={{fontWeight: 'bold', color: idx === statusHistory.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)'}}>
                                        {hist.status.replace(/_/g, ' ')}
                                    </div>
                                    <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem'}}>
                                        {new Date(hist.timestamp).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    <div style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.3rem'}}>
                                        {hist.status === 'NEED_IDENTIFIED' && 'CSR need created'}
                                        {hist.status === 'AI_ASSESSMENT' && 'AI need analysis completed'}
                                        {hist.status === 'PRIORITIZED' && 'Priority assessment completed'}
                                        {hist.status === 'MATCHED' && 'NGO matches generated'}
                                        {hist.status === 'RECOMMENDED' && 'Recommendation explanations generated'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center" style={{padding: '2rem 1rem', color: 'var(--text-secondary)'}}>
                            No status history available.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default CSRNeedDetail;
