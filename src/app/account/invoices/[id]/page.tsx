import InvoiceDetailWrapper from './InvoiceDetailWrapper';
import { Metadata } from 'next';

type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Page({ params }: PageProps) {
  const { id } = params;
  return <InvoiceDetailWrapper id={id} />;
}
