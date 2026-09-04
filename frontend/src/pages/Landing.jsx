import React from 'react';
import { PageHeader, Card, CardHeader, CardBody, Badge, Button, LoadingState, ErrorState, Skeleton, SkeletonCard, StatusBadge, EmptyState } from '../components/UI';

import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
            <header style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
                    <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.4rem', borderRadius: 'var(--radius-md)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    Inspectra
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/signin" className="btn btn-secondary">Sign In</Link>
                    <Link to="/signup" className="btn btn-primary">Get Started</Link>
                </div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
                <div className="badge badge-info mb-4 animate-fade-in-up">Enterprise CSR Management</div>
                <h1 className="animate-fade-in-up delay-100" style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', maxWidth: '800px', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '1.5rem' }}>
                    Intelligent CSR Need Assessment & NGO Matching
                </h1>
                <p className="animate-fade-in-up delay-200 text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '2.5rem' }}>
                    Streamline your corporate social responsibility lifecycle. Use Inspectra's structured matching engine and AI analysis to connect verified requirements with trusted NGO partners.
                </p>
                <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/signup" className="btn btn-primary" style={{ padding: '0.875rem 1.5rem', fontSize: '1rem' }}>Get Started</Link>
                    <Link to="/help" className="btn btn-secondary" style={{ padding: '0.875rem 1.5rem', fontSize: '1rem' }}>Explore Platform</Link>
                </div>

                <div className="animate-fade-in-up delay-300 mt-4" style={{ marginTop: '5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['CSR Need', '?', 'AI Analysis', '?', 'NGO Matching', '?', 'Recommendation', '?', 'Tracking'].map((step, i) => (
                        <div key={i} style={{ padding: step === '?' ? '0.75rem 0' : '0.75rem 1.5rem', background: step === '?' ? 'transparent' : 'var(--surface)', border: step === '?' ? 'none' : '1px solid var(--border)', borderRadius: 'var(--radius-full)', fontWeight: step === '?' ? 400 : 600, color: step === '?' ? 'var(--text-tertiary)' : 'var(--text-secondary)', fontSize: '0.875rem', boxShadow: step === '?' ? 'none' : 'var(--shadow-sm)' }}>
                            {step}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Landing;
