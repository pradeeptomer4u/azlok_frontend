'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatTaxPercentage } from '../../utils/taxService';

// Export the Product interface so it can be imported elsewhere
export interface Product {
  id: number;
  name: string;
  image: string;
  slug: string;
  price: number;
  minOrder: number;
  seller: string;
  seller_id?: number;
  location: string;
  category: string;
  rating: number;
  isVerified: boolean;
  tax_percentage?: number;
  tax_amount?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  is_tax_inclusive?: boolean;
  hsn_code?: string;
  price_with_tax?: number;
  price_without_tax?: number;
}

// Export the props interface as well
export interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <Link href={`/products/${product.slug}`} className="flex-grow">
        <div className="relative">
          <div className="relative h-40 sm:h-48 bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-contain p-2 sm:p-4"
            />
          </div>
          {product.isVerified && (
            <div className="absolute top-2 right-2 bg-primary bg-opacity-20 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="hidden xs:inline">Verified</span>
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-medium text-gray-800 hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base h-10 sm:h-12">
            {product.name}
          </h3>
          <p className="text-primary font-bold mt-1 sm:mt-2 text-base sm:text-lg">
            {formatCurrency(product.price)}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Min. Order: {product.minOrder} units
          </p>
          
          {/* Tax Information Badge */}
          {product.tax_percentage && (
            <div className="mt-1 flex items-center">
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3-3 2 2 2-2 2 2 2-2 3 3z" />
                </svg>
                <span>
                  {product.is_tax_inclusive ? 'Incl.' : '+'} {formatTaxPercentage(product.tax_percentage)} GST
                </span>
              </span>
            </div>
          )}
          
          {/* Display final price with tax if available */}
          {product.price_with_tax && product.price_with_tax !== product.price && (
            <p className="text-xs text-gray-500 mt-0.5">
              {product.is_tax_inclusive ? 'Price includes tax' : `Final price: ${formatCurrency(product.price_with_tax)}`}
            </p>
          )}
          <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-gray-600 truncate">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="truncate">{product.seller}</span>
          </div>
          <div className="mt-1 flex items-center text-xs sm:text-sm text-gray-600 truncate">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{product.location}</span>
          </div>
          <div className="mt-2 flex items-center">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-gray-600 text-xs" aria-label={`Rating ${product.rating} out of 5`}>{product.rating}</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 mt-auto">
        <div className="flex space-x-2">
          <a 
            href={`https://wa.me/8800412138?text=Hi, I'm interested in ${encodeURIComponent(product.name)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 bg-opacity-20 text-gray-800 py-1.5 sm:py-2 rounded-md hover:bg-green-600 hover:bg-opacity-30 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 flex items-center justify-center"
            aria-label={`Contact via WhatsApp for ${product.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            <span className="hidden xs:inline">WhatsApp</span>
          </a>
          <button 
            className="flex-1 bg-primary bg-opacity-20 text-gray-800 py-1.5 sm:py-2 rounded-md hover:bg-primary hover:bg-opacity-30 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart functionality would go here
              alert(`Added ${product.name} to cart`);
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="hidden xs:inline">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
