import InvoiceDetailWrapper from './InvoiceDetailWrapper';

type InvoiceParams = {
  id: string;
};

export default function Page({ params }: { params: InvoiceParams }) {
  const { id } = params;
  return <InvoiceDetailWrapper id={id} />;
}
