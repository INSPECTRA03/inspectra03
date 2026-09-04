import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';
import { ShieldCheck } from 'lucide-react';
import { setRole } from '../services/auth';

const SignIn = () => {
    const navigate = useNavigate();
    const [role, setSelectedRole] = useState('CORPORATE_ADMIN');

    const handleSubmit = (e) => {
        e.preventDefault();
        setRole(role);
        navigate('/dashboard');
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)'}}>
            <div className="card" style={{width: '100%', maxWidth: '400px', padding: '2rem'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem'}}>
                    <Link to="/" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '1.5rem'}}>
                        <div style={{background: 'var(--accent)', color: '#fff', padding: '0.5rem', borderRadius: 'var(--radius-md)'}}>
                            <ShieldCheck size={24} />
                        </div>
                        <span style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px'}}>Inspectra</span>
                    </Link>
                    <h2 style={{margin: 0, color: 'var(--text-primary)'}}>Sign In</h2>
                    <p style={{margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Select your role to access the platform</p>
                </div>

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
                    <Button type="submit" style={{width: '100%', marginTop: '0.5rem'}}>Sign In</Button>
                </form>

                <div style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
                    Don't have an account? <Link to="/signup" style={{color: 'var(--accent)', textDecoration: 'none', fontWeight: 600}}>Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
