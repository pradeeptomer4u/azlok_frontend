import CategoryDetailClient from '@/components/categories/CategoryDetailClient';

export async function generateMetadata({ params }: PageProps<'/categories/[slug]'>) {
  const { slug } = await params;
  
  // For a real app, you would fetch the category data here
  // For now, we'll create a formatted title from the slug
  const formattedCategoryName = slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
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
      siteName: 'Azlok',
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
}

// Main category page component (server component)
export default async function CategoryPage(props: PageProps<'/categories/[slug]'>) {
  const { slug } = await props.params;
  return <CategoryDetailClient slug={slug} />;
}
