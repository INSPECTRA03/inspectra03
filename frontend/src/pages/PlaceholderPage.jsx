import React from 'react';
import { PageHeader, EmptyState } from '../components/UI';
import { Sparkles, Activity } from 'lucide-react';

const PlaceholderPage = ({ title, description }) => {
  return (
    <>
      <PageHeader title={title} subtitle="Future Stage Implementation" />
      <EmptyState 
        title={`${title} Module`} 
        message={description} 
        icon={title === 'Recommendations' ? Sparkles : Activity} 
      />
    </>
  );
};

export default PlaceholderPage;
