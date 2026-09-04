import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const StatusBadge = ({ status, type = "status" }) => {
  if (!status) return null;
  const text = status.toString().toUpperCase();
  let colorClass = "badge-neutral";
  
  if (type === "priority") {
    if (text === "HIGH") colorClass = "badge-high";
    else if (text === "MEDIUM") colorClass = "badge-medium";
    else if (text === "LOW") colorClass = "badge-low";
  } else {
    colorClass = "badge-accent";
  }

  return <span className={`badge ${colorClass} animate-fade-in`}>{status}</span>;
};

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="page-header">
    <div>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const EmptyState = ({ title, message, action, icon: Icon }) => (
  <div className="state-container">
    {Icon && <Icon />}
    <h3 style={{color: "var(--primary)", marginBottom: "0.5rem", fontWeight: 600}}>{title}</h3>
    <p style={{marginBottom: "1.5rem", fontSize: "0.875rem"}}>{message}</p>
    {action && <div>{action}</div>}
  </div>
);

export const LoadingState = ({ message = "Loading..." }) => (
  <div className="state-container" style={{background: "transparent", border: "none"}}>
    <Loader2 className="animate-spin" style={{animation: "spin 1s linear infinite"}} />
    <p>{message}</p>
  </div>
);

export const ErrorState = ({ message }) => (
  <div className="state-container" style={{borderColor: "var(--error-bg)", backgroundColor: "#fff", color: "var(--error)"}}>
    <AlertCircle color="var(--error)" />
    <h3 style={{marginBottom: "0.5rem"}}>Something went wrong</h3>
    <p style={{fontSize: "0.875rem"}}>{message}</p>
  </div>
);

export const MetricCard = ({ title, value }) => (
  <div className="card">
    <div className="card-body">
      <div className="text-muted" style={{fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem"}}>{title}</div>
      <div style={{fontSize: "2rem", fontWeight: 600, color: "var(--primary)"}}>{value}</div>
    </div>
  </div>
);
