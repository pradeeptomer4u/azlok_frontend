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

// Mock testimonial data to avoid 404 errors
const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    company: 'Tech Solutions Ltd',
    image: '/globe.svg',
    testimonial: 'Azlok has been a game-changer for our business. The quality of products and reliability of service is unmatched in the industry.',
    rating: 5,
    date: '2023-06-15',
    verified: true
  },
  {
    id: 2,
    name: 'Priya Patel',
    company: 'Innovate Designs',
    image: '/globe.svg',
    testimonial: 'We have been sourcing materials from Azlok for over two years now. Their consistent quality and on-time delivery have helped us grow our business significantly.',
    rating: 4.5,
    date: '2023-05-22',
    verified: true
  },
  {
    id: 3,
    name: 'Amit Kumar',
    company: 'Global Traders',
    image: '/globe.svg',
    testimonial: 'The customer service at Azlok is exceptional. They go above and beyond to ensure customer satisfaction. Highly recommended!',
    rating: 5,
    date: '2023-04-10',
    verified: true
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    company: 'Creative Solutions',
    image: '/globe.svg',
    testimonial: 'Azlok offers a wide range of high-quality products at competitive prices. Their platform is user-friendly and makes procurement a breeze.',
    rating: 4,
    date: '2023-03-05',
    verified: true
  }
];

// Testimonial service with mock data
const testimonialService = {
  // Get all testimonials
  getAllTestimonials: async (): Promise<Testimonial[]> => {
    // Return mock data instead of API call to avoid 404
    return mockTestimonials;
  },
  
  // Get featured testimonials
  getFeaturedTestimonials: async (limit: number = 4): Promise<Testimonial[]> => {
    // Return limited mock data
    return mockTestimonials.slice(0, limit);
  },
  
  // Get testimonial by ID
  getTestimonialById: async (id: number): Promise<Testimonial | null> => {
    // Find testimonial by ID from mock data
    const testimonial = mockTestimonials.find(t => t.id === id);
    return testimonial || null;
  }
};

export default testimonialService;
