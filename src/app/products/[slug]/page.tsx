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
    <div className="min-h-screen py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
      {/* Advanced background graphics */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-5 bg-repeat mix-blend-overlay"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-300/25 to-green-400/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -left-24 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-green-300/10 rounded-full blur-3xl animate-float1"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-yellow-200/10 to-orange-200/5 rounded-full blur-3xl animate-float2"></div>
        
        {/* Decorative geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-green-200/10 rounded-lg opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-green-200/10 rounded-full opacity-10"></div>
      </div>
      
      <div className="container-custom mx-auto relative z-10">
        <ProductDetail slug={slug} />
      </div>
    </div>
  );
}
