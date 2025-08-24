import { apiRequest } from '../utils/apiRequest';

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  image: string;
  testimonial: string;
  rating: number;
  date: string;
  verified: boolean;
}


// Testimonial API service
const testimonialService = {
  // Get all testimonials
  getAllTestimonials: async (): Promise<Testimonial[]> => {
    try {
      const response = await apiRequest<Testimonial[]>('/api/testimonials');
      return response || [];
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },
  
  // Get featured testimonials
  getFeaturedTestimonials: async (limit: number = 4): Promise<Testimonial[]> => {
    try {
      const response = await apiRequest<Testimonial[]>(`/api/testimonials/featured?limit=${limit}`);
      return response || [];
    } catch (error) {
      console.error('Error fetching featured testimonials:', error);
      return [];
    }
  },
  
  // Get testimonial by ID
  getTestimonialById: async (id: number): Promise<Testimonial | null> => {
    try {
      const response = await apiRequest<Testimonial>(`/api/testimonials/${id}`);
      return response || null;
    } catch (error) {
      console.error(`Error fetching testimonial with ID ${id}:`, error);
      return null;
    }
  }
};

export default testimonialService;
