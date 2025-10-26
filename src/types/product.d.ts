export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  slug?: string;
}

export interface Product {
  id: number;
  name: string;
  image?: string;
  image_url?: string[] | string; // Backend API uses image_url as either an array or a string
  image_urls?: string[]; // From API response
  slug: string;
  price: number;
  original_price?: number; // For discount calculation
  minOrder?: number;
  seller?: string;
  seller_id?: number;
  location?: string;
  category?: string;
  categories?: Category[]; // From API response
  rating?: number;
  isVerified?: boolean;
  description?: string;
}

export interface ProductCardProps {
  product: Product;
}
