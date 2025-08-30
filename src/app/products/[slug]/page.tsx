import ProductDetail from '../../../components/products/ProductDetail';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  // In a real app, fetch product data from API
  // const product = await fetch(`/api/products/${slug}`).then(res => res.json());
  
  // For now, using a placeholder title
  return {
    title: `Product Details | Azlok Enterprises`,
    description: 'View detailed product specifications, pricing, and supplier information',
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen py-8">
      <div className="container-custom mx-auto">
        <ProductDetail slug={slug} />
      </div>
    </div>
  );
}
