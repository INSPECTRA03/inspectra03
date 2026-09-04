import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';
import { ShieldCheck } from 'lucide-react';

const SignUp = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '2rem'}}>
            <div className="card" style={{width: '100%', maxWidth: '440px', padding: '2rem'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem'}}>
                    <Link to="/" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '1.5rem'}}>
                        <div style={{background: 'var(--accent)', color: '#fff', padding: '0.5rem', borderRadius: 'var(--radius-md)'}}>
                            <ShieldCheck size={24} />
                        </div>
                        <span style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px'}}>Inspectra</span>
                    </Link>
                    <h2 style={{margin: 0, color: 'var(--text-primary)'}}>Create Account</h2>
                    <p style={{margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Join Inspectra Corporate Platform</p>
                </div>

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
                    
                    <Button type="submit" style={{width: '100%', marginTop: '0.5rem'}}>Sign Up</Button>
                </form>

                <div style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
                    Already have an account? <Link to="/signin" style={{color: 'var(--accent)', textDecoration: 'none', fontWeight: 600}}>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;