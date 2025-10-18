'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatTaxPercentage } from '../../utils/taxService';
import { useCart } from '../../context/CartContext';

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
  const { addItem } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      product_id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      seller: product.seller,
      seller_id: product.seller_id,
      minOrder: product.minOrder,
      tax_amount: product.tax_amount,
      cgst_amount: product.cgst_amount,
      sgst_amount: product.sgst_amount,
      igst_amount: product.igst_amount,
      is_tax_inclusive: product.is_tax_inclusive,
      hsn_code: product.hsn_code
    });
    
    // Show visual feedback
    setAddedToCart(true);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };
  return (
    <div className="bg-[#defce8]/90 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:scale-[1.02] group">
      <Link href={`/products/${product.slug}`} className="flex-grow">
        <div className="relative">
          <div className="relative h-40 sm:h-48 bg-white overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-green-300/30 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-green-300/30 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          {product.isVerified && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-md transform -rotate-2 group-hover:rotate-0 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="hidden xs:inline font-medium tracking-wide">Verified</span>
            </div>
          )}
          
          {/* Artisan/Farmer Badge */}
          <div className="absolute top-2 left-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white text-xs px-3 py-1 rounded-full flex items-center shadow-md transform rotate-2 group-hover:rotate-0 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2M3 16V6a3 3 0 013-3h12a3 3 0 013 3v10a3 3 0 01-3 3H6a3 3 0 01-3-3z" />
            </svg>
            <span className="hidden xs:inline font-medium tracking-wide">Artisanal</span>
          </div>
        </div>
        <div className="p-3 sm:p-4 relative">
          {/* Subtle decorative element */}
          <div className="absolute -top-6 right-4 w-12 h-12 bg-green-100/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 className="font-['Playfair_Display',serif] font-semibold text-gray-800 group-hover:text-green-700 transition-colors line-clamp-2 text-sm sm:text-base h-10 sm:h-12 relative z-10">
            {product.name}
          </h3>
          <p className="text-primary font-bold mt-1 sm:mt-2 text-base sm:text-lg font-['Montserrat',sans-serif] tracking-tight">
            {formatCurrency(product.price)}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 font-['Montserrat',sans-serif] font-light tracking-wide">
            Min. Order: {product.minOrder} units
          </p>
          

          
          {/* Display final price with tax if available */}


          <div className="mt-2 flex items-center">
            <div className="flex items-center text-yellow-500 relative">
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 bg-yellow-100/30 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Full stars */}
              {[...Array(4)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              {/* Half star */}
              <div className="relative">
                {/* Gray background star */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {/* Yellow half star overlay */}
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <span className="ml-1 text-gray-600 text-xs" aria-label="Rating 4.5 out of 5">4.5</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 mt-auto relative">
        {/* Decorative wave pattern */}
        <div className="absolute -top-6 left-0 right-0 h-6 opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#4ade80" fillOpacity="0.2" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div className="flex space-x-2">
          <a 
            href={`https://wa.me/8800412138?text=Hi, I'm interested in ${encodeURIComponent(product.name)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-green-500/20 to-green-600/20 text-gray-800 py-1.5 sm:py-2 rounded-md hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 flex items-center justify-center shadow-sm hover:shadow group relative overflow-hidden"
            aria-label={`Contact via WhatsApp for ${product.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            <span className="hidden xs:inline">WhatsApp</span>
          </a>
          <button 
            className={`flex-1 py-1.5 sm:py-2 rounded-md transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center shadow-sm hover:shadow relative overflow-hidden ${addedToCart ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-primary/20 to-primary/20 text-gray-800 hover:from-primary/30 hover:to-primary/30'}`}
            onClick={handleAddToCart}
            disabled={addedToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedToCart ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden xs:inline">Added!</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden xs:inline">Add to Cart</span>
              </>
            )}
          </button>
          {/* Add subtle hover effect for buttons */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-300/0 via-green-400/20 to-green-300/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
