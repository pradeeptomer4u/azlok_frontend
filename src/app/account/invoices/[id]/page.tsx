'use client';

import { useParams } from 'next/navigation';
import InvoiceDetailWrapper from './InvoiceDetailWrapper';

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  
  return <InvoiceDetailWrapper id={id} />;
}
