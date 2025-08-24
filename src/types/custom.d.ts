// Type declarations for custom components
declare module '../../components/products/ProductFilters' {
  const ProductFilters: React.ComponentType;
  export default ProductFilters;
}

declare module './ProductCard' {
  interface Product {
    id: number;
    name: string;
    image: string;
    slug: string;
    price: number;
    minOrder: number;
    seller: string;
    location: string;
    category: string;
    rating: number;
    isVerified: boolean;
  }
  
  interface ProductCardProps {
    product: Product;
  }
  
  const ProductCard: React.FC<ProductCardProps>;
  export default ProductCard;
}

// Add declarations for other missing modules as needed
declare module 'xs:inline' {
  const value: string;
  export default value;
}
