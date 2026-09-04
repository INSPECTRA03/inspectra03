import React, { useState } from 'react';
import { PageHeader, Card, CardHeader, CardBody, Badge, Button, LoadingState, ErrorState, Skeleton, SkeletonCard, StatusBadge, EmptyState } from '../components/UI';

import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { setRole } from '../services/auth';

const SignIn = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const [role, setSelectedRole] = useState('CORPORATE_ADMIN');

    const handleSubmit = (e) => {
        e.preventDefault();
        setRole(role);
        navigate('/dashboard');
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)'}}>
            <div className="card animate-fade-in-up" style={{width: '90%', maxWidth: '400px', padding: '2.5rem 2rem'}}>
                <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                    <div style={{display: 'inline-flex', background: 'var(--primary)', color: '#fff', padding: '0.75rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h1 style={{fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)'}}>Sign in to Inspectra</h1>
                </div>
                {error && <div className="alert alert-error" style={{marginBottom: '1.5rem'}}>{error}</div>}
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div>
                        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-primary)'}}>Demo Role</label>
                        <select 
                            value={role} 
                            onChange={(e) => setSelectedRole(e.target.value)}
                            style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', backgroundColor: 'var(--surface)', color: 'var(--text-primary)', fontFamily: 'inherit'}}
                        >
                            <option value="CORPORATE_ADMIN">Corporate CSR Admin</option>
                            <option value="CSR_MANAGER">CSR Manager / Officer</option>
                            <option value="NGO_PARTNER">NGO Partner</option>
                        </select>
                    </div>
                    <div>
                        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-primary)'}}>Email (Mock)</label>
                        <input type="email" placeholder="user@example.com" style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', backgroundColor: 'var(--background)'}} />
                    </div>
                    <div>
                        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-primary)'}}>Password (Mock)</label>
                        <input type="password" placeholder="********" style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', backgroundColor: 'var(--background)'}} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '0.5rem'}}>Sign In</button>
                </form>

                <div style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
                    Don't have an account? <Link to="/signup" style={{color: 'var(--accent)', textDecoration: 'none', fontWeight: 600}}>Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
