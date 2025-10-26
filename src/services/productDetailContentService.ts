import axios from 'axios';

export interface ProductDetailContent {
  id: number;
  product_id: number;
  title: string;
  title_hi?: string;
  brand: string;
  brand_hi?: string;
  history: string;
  history_hi?: string;
  science: string;
  science_hi?: string;
  ayurveda: string;
  ayurveda_hi?: string;
  modern: string;
  modern_hi?: string;
  [key: string]: string | number | undefined; // Add index signature to allow string indexing
}

export interface ProductFAQ {
  id: number;
  product_id: number;
  questions1: string;
  questions1_hi?: string;
  answer1: string;
  answer1_hi?: string;
  questions2: string;
  questions2_hi?: string;
  answer2: string;
  answer2_hi?: string;
  questions3: string;
  questions3_hi?: string;
  answer3: string;
  answer3_hi?: string;
  questions4: string;
  questions4_hi?: string;
  answer4: string;
  answer4_hi?: string;
  questions5: string;
  questions5_hi?: string;
  answer5: string;
  answer5_hi?: string;
  [key: string]: string | number | undefined; // Add index signature to allow string indexing
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azlok.com';

const productDetailContentService = {
  getProductDetailContent: async (slug: string): Promise<ProductDetailContent & ProductFAQ> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/detail-content/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product detail content:', error);
      throw error;
    }
  }
};

export default productDetailContentService;
