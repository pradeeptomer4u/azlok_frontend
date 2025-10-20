import ProductDetailClient from './ProductDetailClient';

export const runtime = "edge";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Render the client component and pass the id
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
