'use client';

import InvoiceDetailClient from './InvoiceDetailClient';

export default function InvoiceDetailWrapper({ id }: { id: string }) {
  return <InvoiceDetailClient id={id} />;
}
