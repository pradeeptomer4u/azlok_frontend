'use client';

import { useParams } from 'next/navigation';
import InvoiceDetailClient from './InvoiceDetailClient';

export default function InvoiceDetailWrapper() {
  const params = useParams();
  const id = params?.id as string;
  
  return <InvoiceDetailClient id={id} />;
}
