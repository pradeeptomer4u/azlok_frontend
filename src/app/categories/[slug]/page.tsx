import Link from 'next/link';
import { Metadata } from 'next';
import { BreadcrumbStructuredData } from '@/components/SEO/StructuredData';
import CategoryDetailClient from '@/components/categories/CategoryDetailClient';

// Define the params type separately
type CategoryParams = {
  slug: string;
};

// Use the correct Next.js App Router types
type CategoryPageProps = {
  params: CategoryParams;
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: { params: CategoryParams }): Promise<Metadata> {
  const { slug } = params;
  
  // For a real app, you would fetch the category data here
  // For now, we'll create a formatted title from the slug
  const formattedCategoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `${formattedCategoryName} - Azlok`,
    description: `Browse ${formattedCategoryName} products at Azlok. Find the best deals and quality items.`.substring(0, 160),
    keywords: `${formattedCategoryName}, products, shopping, ${slug}, online shopping`,
    alternates: {
      canonical: `/categories/${slug}`,
    },
    openGraph: {
      title: `${formattedCategoryName} - Azlok`,
      description: `Browse ${formattedCategoryName} products at Azlok. Find the best deals and quality items.`.substring(0, 160),
      url: `/categories/${slug}`,
      siteName: 'Azlok Enterprises',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${formattedCategoryName} Category`,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedCategoryName} - Azlok`,
      description: `Browse ${formattedCategoryName} products at Azlok. Find the best deals and quality items.`.substring(0, 160),
      images: ['/logo.png'],
      creator: '@azlok',
      site: '@azlok',
    },
  };
};

export default function CategoryPage({ params }: { params: CategoryParams }) {
  return (
    <CategoryDetailClient slug={params.slug} />
  );
}
