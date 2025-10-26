// Export all SEO components for easier imports

// Modern schema components (using next/script)
export { default as MetaTags } from './MetaTags';
export { default as WebsiteSchema } from './WebsiteSchema';
export { default as BreadcrumbSchema } from './BreadcrumbSchema';
export { default as OrganizationSchema } from './OrganizationSchema';
export { default as ProductSchema } from './ProductSchema';
export { default as CanonicalUrl } from './CanonicalUrl';
export { default as FAQSchema } from './FAQSchema';
export { default as BlogPostingSchema } from './BlogPostingSchema';

// Legacy schema components (using next/head)
export { 
  ProductStructuredData,
  BreadcrumbStructuredData,
  OrganizationStructuredData,
  LocalBusinessStructuredData
} from './StructuredData';

// Add any other SEO components here as they are created
