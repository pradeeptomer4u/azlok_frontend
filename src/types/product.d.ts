export interface Product {
  id: number;
  name: string;
  image: string;
  image_url?: string; // Backend API uses image_url
  slug: string;
  price: number;
  original_price?: number; // For discount calculation
  minOrder: number;
  seller: string;
  seller_id?: number;
  location: string;
  category: string;
  rating: number;
  isVerified: boolean;
}

export interface ProductCardProps {
  product: Product;
}
