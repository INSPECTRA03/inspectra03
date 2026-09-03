import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCSRNeed, analyzeCSRNeed, assessCSRNeedPriority } from '../services/api';

const CSRNeedDetail = () => {
    const { id } = useParams();
    const [need, setNeed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [analyzing, setAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);

    const [assessing, setAssessing] = useState(false);
    const [priorityError, setPriorityError] = useState(null);

    useEffect(() => {
        async function loadNeed() {
            try {
                const data = await fetchCSRNeed(id);
                setNeed(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadNeed();
    }, [id]);

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setAnalysisError(null);
        try {
            const response = await analyzeCSRNeed(need.id);
            setNeed(prev => ({ ...prev, ai_analysis: response.analysis, status: 'AI_ASSESSMENT' }));
        } catch (err) {
            setAnalysisError(err.message || 'AI analysis is temporarily unavailable. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleAssessPriority = async () => {
        setAssessing(true);
        setPriorityError(null);
        try {
            const response = await assessCSRNeedPriority(need.id);
            setNeed(prev => ({
                ...prev,
                priority_score: response.priority_score,
                priority: response.priority,
                priority_reason: response.reason
            }));
        } catch (err) {
            setPriorityError(err.message || 'Failed to assess priority.');
        } finally {
            setAssessing(false);
        }
    };

    if (loading) return <div>Loading CSR Need Details...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!need) return <div className="error-message">CSR Need not found.</div>;

    return (
        <div className="detail-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>CSR Need #{need.id}</h1>
                <Link to="/csr-needs" className="btn-secondary">Back to List</Link>
            </div>

            <div className="detail-card" style={{ marginBottom: '2rem' }}>
                <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className="badge badge-status">{need.status.replace(/_/g, ' ')}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{need.location.city}, {need.location.district}, {need.location.state}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{need.category}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Beneficiary</span>
                    <span className="detail-value">{need.beneficiary_count} {need.beneficiary_type}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Urgency</span>
                    <span className={`badge badge-${need.urgency.toLowerCase()}`}>{need.urgency}</span>
                </div>
                <div className="detail-row" style={{ alignItems: 'flex-start' }}>
                    <span className="detail-label">Description</span>
                    <p className="detail-value" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{need.description}</p>
                </div>
                <div className="detail-row" style={{ borderBottom: 'none' }}>
                    <span className="detail-label">Created Date</span>
                    <span className="detail-value">{new Date(need.created_at).toLocaleString()}</span>
                </div>
            </div>

            <div className="detail-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Priority Assessment</h2>

                {priorityError && <div className="error-message">{priorityError}</div>}

                {!need.priority_score && (
                    <div>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            This CSR Need has not been assessed for priority yet.
                        </p>
                        <button
                            className="btn-primary"
                            onClick={handleAssessPriority}
                            disabled={assessing || !need.ai_analysis}
                            title={!need.ai_analysis ? "AI analysis is required before priority assessment." : ""}
                        >
                            {assessing ? 'Assessing priority...' : 'Assess Priority'}
                        </button>
                        {!need.ai_analysis && (
                            <p style={{ marginTop: '1rem', color: '#92400e', fontSize: '0.875rem' }}>
                                * AI analysis is required before priority assessment.
                            </p>
                        )}
                    </div>
                )}

                {need.priority_score && (
                    <div>
                        <div className="detail-row">
                            <span className="detail-label">Priority Level</span>
                            <span className={`badge badge-${need.priority.toLowerCase()}`}>{need.priority}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Priority Score</span>
                            <span className="detail-value"><strong>{need.priority_score}</strong></span>
                        </div>
                        <div className="detail-row" style={{ alignItems: 'flex-start', borderBottom: 'none' }}>
                            <span className="detail-label">Reason</span>
                            <p className="detail-value" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{need.priority_reason}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="detail-card">
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>AI Analysis</h2>

                {analysisError && <div className="error-message">{analysisError}</div>}

                {!need.ai_analysis && (
                    <div>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>This CSR Need has not been analyzed by AI yet.</p>
                        <button
                            className="btn-primary"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                        >
                            {analyzing ? 'Analyzing CSR need...' : 'Analyze with AI'}
                        </button>
                    </div>
                )}

                {need.ai_analysis && (
                    <div>
                        <div className="detail-row">
                            <span className="detail-label">Summary</span>
                            <span className="detail-value">{need.ai_analysis.summary}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Identified Category</span>
                            <span className="detail-value">{need.ai_analysis.identified_category}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Beneficiary Group</span>
                            <span className="detail-value">{need.ai_analysis.beneficiary_group}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Required Intervention</span>
                            <span className="detail-value">{need.ai_analysis.required_intervention}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Key Need</span>
                            <span className="detail-value">{need.ai_analysis.key_need}</span>
                        </div>
                        <div className="detail-row" style={{ alignItems: 'flex-start', borderBottom: 'none' }}>
                            <span className="detail-label">Analysis</span>
                            <p className="detail-value" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{need.ai_analysis.analysis}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CSRNeedDetail;
