'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const runtime = "edge";

export default function AdminDashboardRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main admin page
    router.replace('/admin');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-3">Redirecting to admin dashboard...</p>
    </div>
  );
}
