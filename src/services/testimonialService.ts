import apiRequest from './api';

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

// Mock testimonials data - in a real app, this would come from an API
const mockTestimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    company: 'Tech Solutions Pvt Ltd',
    image: '/testimonials/person1.jpg', // Would need to add these images to public folder
    testimonial: 'Azlok Enterprises has transformed how we source our electronic components. The platform is intuitive, and the quality of suppliers is exceptional. Our procurement process is now 40% faster.',
    rating: 5,
    date: '2025-07-15',
    verified: true
  },
  {
    id: 2,
    name: 'Priya Sharma',
    company: 'Global Textiles Manufacturing',
    image: '/testimonials/person2.jpg',
    testimonial: 'As a textile manufacturer, finding reliable raw material suppliers was always challenging. Since joining Azlok, we\'ve connected with verified suppliers who deliver consistent quality. Highly recommended!',
    rating: 5,
    date: '2025-07-22',
    verified: true
  },
  {
    id: 3,
    name: 'Vikram Singh',
    company: 'Innovative Machinery Ltd',
    image: '/testimonials/person3.jpg',
    testimonial: 'The seller verification process on Azlok gives us confidence when making large purchases. We\'ve expanded our business network significantly and found new clients through the platform.',
    rating: 4,
    date: '2025-08-01',
    verified: true
  },
  {
    id: 4,
    name: 'Ananya Patel',
    company: 'Organic Foods Export',
    image: '/testimonials/person4.jpg',
    testimonial: 'Azlok\'s platform helped us reach international buyers we couldn\'t access before. The product approval workflow ensures that only quality products are listed, maintaining high standards.',
    rating: 5,
    date: '2025-08-05',
    verified: true
  },
  {
    id: 5,
    name: 'Suresh Menon',
    company: 'Healthcare Supplies Co.',
    image: '/testimonials/person5.jpg',
    testimonial: 'The invoice management system on Azlok has streamlined our accounting process. We can now generate and track invoices effortlessly, saving hours of administrative work each week.',
    rating: 5,
    date: '2025-08-10',
    verified: true
  },
  {
    id: 6,
    name: 'Meera Kapoor',
    company: 'Sustainable Packaging Solutions',
    image: '/testimonials/person6.jpg',
    testimonial: 'As a small business, we appreciate how Azlok has made tax compliance easier. The automated GST calculations and documentation have reduced our compliance burden significantly.',
    rating: 4,
    date: '2025-08-12',
    verified: true
  },
  {
    id: 7,
    name: 'Arjun Reddy',
    company: 'Modern Office Interiors',
    image: '/testimonials/person7.jpg',
    testimonial: 'The payment processing on Azlok is secure and efficient. Multiple payment options make it convenient for our customers, and the transaction history is well-organized for our records.',
    rating: 5,
    date: '2025-08-15',
    verified: true
  },
  {
    id: 8,
    name: 'Neha Gupta',
    company: 'Safety Equipment Distributors',
    image: '/testimonials/person8.jpg',
    testimonial: 'We\'ve been using Azlok for over six months now, and the platform keeps improving. The recent updates to the product management features have made listing and updating our inventory much faster.',
    rating: 5,
    date: '2025-08-20',
    verified: true
  }
];

// Testimonial API service
const testimonialService = {
  // Get all testimonials
  getAllTestimonials: async (): Promise<Testimonial[]> => {
    // In a real implementation, this would be:
    // return apiRequest('/testimonials');
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTestimonials);
      }, 300);
    });
  },
  
  // Get featured testimonials
  getFeaturedTestimonials: async (limit: number = 4): Promise<Testimonial[]> => {
    // In a real implementation, this would be:
    // return apiRequest(`/testimonials/featured?limit=${limit}`);
    
    // Simulate API delay and return random testimonials
    return new Promise((resolve) => {
      setTimeout(() => {
        // Shuffle array and take requested number
        const shuffled = [...mockTestimonials].sort(() => 0.5 - Math.random());
        resolve(shuffled.slice(0, limit));
      }, 300);
    });
  },
  
  // Get testimonial by ID
  getTestimonialById: async (id: number): Promise<Testimonial> => {
    // In a real implementation, this would be:
    // return apiRequest(`/testimonials/${id}`);
    
    // Simulate API delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const testimonial = mockTestimonials.find(t => t.id === id);
        if (testimonial) {
          resolve(testimonial);
        } else {
          reject(new Error('Testimonial not found'));
        }
      }, 300);
    });
  }
};

export default testimonialService;
