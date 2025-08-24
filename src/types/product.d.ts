export interface Product {
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

export interface ProductCardProps {
  product: Product;
}
