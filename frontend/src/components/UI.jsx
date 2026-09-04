import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    return (
        <button className={`btn btn-${variant} ${className}`} {...props}>
            {children}
        </button>
    );
};

export const Card = ({ children, className = '', style = {} }) => (
    <div className={`card ${className}`} style={style}>
        {children}
    </div>
);

export const CardHeader = ({ children, className = '' }) => (
    <div className={`card-header ${className}`}>
        {children}
    </div>
);

export const CardBody = ({ children, className = '', style = {} }) => (
    <div className={`card-body ${className}`} style={style}>
        {children}
    </div>
);

export const Badge = ({ children, variant = 'neutral', className = '' }) => (
    <span className={`badge badge-${variant} ${className}`}>
        {children}
    </span>
);

export const PageHeader = ({ title, subtitle, action }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
            <h1 style={{ fontSize: '2rem', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>{title}</h1>
            {subtitle && <p className="text-muted text-base">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);

export const LoadingState = ({ message = "Loading..." }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
        <svg style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <div style={{ fontWeight: 500 }}>{message}</div>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
    </div>
);

export const ErrorState = ({ message, onRetry }) => (
    <div className="alert alert-error" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span style={{ fontWeight: 500 }}>{message || 'An unexpected error occurred.'}</span>
        </div>
        {onRetry && <button onClick={onRetry} style={{ background: 'none', border: '1px solid currentColor', borderRadius: '4px', padding: '0.25rem 0.5rem', color: 'inherit', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Retry</button>}
    </div>
);

export const Skeleton = ({ height = '1rem', width = '100%', className = '' }) => (
    <div className={`skeleton ${className}`} style={{ height, width }}></div>
);

export const SkeletonCard = () => (
    <Card>
        <CardBody>
            <Skeleton height="1.5rem" width="60%" className="mb-4" />
            <Skeleton height="1rem" className="mb-2" />
            <Skeleton height="1rem" className="mb-2" />
            <Skeleton height="1rem" width="80%" />
        </CardBody>
    </Card>
);

export const StatusBadge = ({ status, className = '' }) => {
    let variant = 'info';
    if (status.includes('HIGH') || status.includes('CRITICAL')) variant = 'danger';
    else if (status.includes('PRIORITIZED') || status.includes('RECOMMENDED') || status.includes('VERIFIED')) variant = 'success';
    else if (status.includes('MEDIUM')) variant = 'warning';
    
    return (
        <span className={`badge badge-${variant} ${className}`}>
            {status}
        </span>
    );
};

export const EmptyState = ({ icon, title, description, action }) => (
    <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
        {icon && <div style={{ color: 'var(--text-tertiary)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{icon}</div>}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>{description}</p>
        {action && <div>{action}</div>}
    </div>
);
