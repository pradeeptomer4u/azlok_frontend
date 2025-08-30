import InvoiceDetailClient from "./InvoiceDetailClient";

type Props = {
  params: { id: string };
}

export default function Page(props: Props) {
  return <InvoiceDetailClient id={props.params.id} />;
}
