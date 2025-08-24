'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import testimonialService, { Testimonial } from '../../services/testimonialService';

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch testimonials from the service
  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get testimonials from the service
        const apiTestimonials = await testimonialService.getAllTestimonials();
        setTestimonials(apiTestimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (testimonials.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">No testimonials available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="w-full flex-shrink-0 px-4"
            >
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center mb-6">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.company}</p>
                    <div className="flex items-center justify-center md:justify-start mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-700 text-center md:text-left">
                  <svg className="h-8 w-8 text-primary opacity-20 mb-2" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm12 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                  </svg>
                  <p className="italic">{testimonial.testimonial}</p>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
        aria-label="Previous testimonial"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
        aria-label="Next testimonial"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 mx-1 rounded-full ${
              currentIndex === index ? 'bg-primary' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
