import { PageHeader, Card, CardHeader, CardBody, Badge, Button, LoadingState, ErrorState, Skeleton, SkeletonCard, StatusBadge, EmptyState } from '../components/UI';

﻿import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ShieldCheck } from 'lucide-react';

const SignUp = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)'}}>
            <div className="card animate-fade-in-up" style={{width: '90%', maxWidth: '400px', padding: '2.5rem 2rem'}}>
                <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                    <div style={{display: 'inline-flex', background: 'var(--primary)', color: '#fff', padding: '0.75rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h1 style={{fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)'}}>Create your account</h1>
                </div>
                {error && <div className="alert alert-error" style={{marginBottom: '1.5rem'}}>{error}</div>}
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                        <div>
                            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem'}}>First Name</label>
                            <input type="text" required style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none'}} />
                        </div>
                        <div>
                            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem'}}>Last Name</label>
                            <input type="text" required style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none'}} />
                        </div>
                    </div>
                    <div>
                        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-primary)'}}>Corporate Email</label>
                        <input type="email" placeholder="name@company.com" required style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none'}} />
                    </div>
                    <div>
                        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-primary)'}}>Company/Organization</label>
                        <input type="text" required style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none'}} />
                    </div>
                    <div>
                        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-primary)'}}>Password</label>
                        <input type="password" required style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none'}} />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '0.5rem'}}>Sign Up</button>
                </form>

                <div style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
                    Already have an account? <Link to="/signin" style={{color: 'var(--accent)', textDecoration: 'none', fontWeight: 600}}>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;