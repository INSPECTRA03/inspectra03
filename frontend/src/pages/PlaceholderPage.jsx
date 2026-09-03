import React from 'react';

const PlaceholderPage = ({ title, description }) => {
  return (
    <div>
      <h1 className="page-title">{title}</h1>
      <div className="placeholder-page">
        <h2 style={{color: 'var(--primary-color)', marginBottom: '1rem'}}>{title} Feature</h2>
        <p>{description}</p>
        <p style={{marginTop: '2rem', fontSize: '0.875rem'}}>This feature is pending implementation in Stage 2.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;