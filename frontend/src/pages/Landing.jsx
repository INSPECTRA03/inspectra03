import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI';
import { ShieldCheck, ArrowRight, Building, Globe } from 'lucide-react';

const Landing = () => {
    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)'}}>
            <header style={{padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid var(--border)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                    <div style={{background: 'var(--accent)', color: '#fff', padding: '0.5rem', borderRadius: 'var(--radius-md)'}}>
                        <ShieldCheck size={24} />
                    </div>
                    <span style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px'}}>Inspectra</span>
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                    <Link to="/signin"><Button variant="secondary">Sign In</Button></Link>
                    <Link to="/signup"><Button variant="primary">Sign Up</Button></Link>
                </div>
            </header>

            <main style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center'}}>
                <span style={{background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '1.5rem', border: '1px solid var(--border)'}}>
                    Corporate Social Responsibility Platform
                </span>
                <h1 style={{fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', maxWidth: '800px', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px'}}>
                    Identify CSR needs. Prioritize impact. Find the right NGO partners.
                </h1>
                <p style={{fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6}}>
                    AI-powered CSR need assessment and deterministic NGO matching. Transform corporate initiatives into measurable social impact instantly.
                </p>
                <div style={{display: 'flex', gap: '1rem'}}>
                    <Link to="/signin">
                        <Button style={{padding: '0.75rem 2rem', fontSize: '1.125rem'}}>
                            Get Started <ArrowRight size={20} style={{marginLeft: '0.5rem'}} />
                        </Button>
                    </Link>
                </div>

                <div style={{display: 'flex', gap: '2rem', marginTop: '4rem', opacity: 0.7}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)'}}>
                        <Globe size={20} /> Data-Driven Discovery
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)'}}>
                        <Building size={20} /> Enterprise Matching
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)'}}>
                        <ShieldCheck size={20} /> Verified Compliance
                    </div>
                </div>
            </main>

            <footer style={{padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', fontSize: '0.875rem', marginTop: 'auto'}}>
                <Link to="/privacy-policy" style={{color: 'inherit', textDecoration: 'none'}}>Privacy Policy</Link>
            </footer>
        </div>
    );
};

export default Landing;