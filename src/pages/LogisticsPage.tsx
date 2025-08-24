import React from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false to prevent server-side rendering issues
const LogisticsPageClient = dynamic(
  () => import('../components/logistics/LogisticsPageClient'),
  { ssr: false }
);

const LogisticsPage: React.FC = () => {
  return <LogisticsPageClient />;
};

export default LogisticsPage;
