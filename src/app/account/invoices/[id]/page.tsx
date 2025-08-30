import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import InvoiceDetailClient from "./InvoiceDetailClient";

export default function Page({ params }: { params: { id: string } }) {
  return <InvoiceDetailClient id={params.id} />;
}
