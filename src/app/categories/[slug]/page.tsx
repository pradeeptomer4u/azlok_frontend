import CategoryDetailClient from '@/components/categories/CategoryDetailClient';
import seoService from '@/services/seoService';

export async function generateMetadata({ params }: PageProps<'/categories/[slug]'>) {
  const { slug } = await params;

  const formattedCategoryName = slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const adminSeo = await seoService.getServerSide('category', slug);

  const defaultTitle = `${formattedCategoryName} - Azlok`;
  const defaultDesc = `Browse ${formattedCategoryName} products at Azlok. Find the best deals and quality items.`.substring(0, 160);
  const ogImage = adminSeo?.og_image || '/logo.png';

  return {
    title: adminSeo?.title || defaultTitle,
    description: adminSeo?.description || defaultDesc,
    keywords: adminSeo?.keywords || `${formattedCategoryName}, products, shopping, ${slug}, online shopping`,
    robots: adminSeo?.robots,
    alternates: {
      canonical: adminSeo?.canonical_url || `/categories/${slug}`,
    },
    openGraph: {
      title: adminSeo?.og_title || adminSeo?.title || defaultTitle,
      description: adminSeo?.og_description || adminSeo?.description || defaultDesc,
      url: `/categories/${slug}`,
      siteName: 'Azlok',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${formattedCategoryName} Category` }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: adminSeo?.og_title || adminSeo?.title || defaultTitle,
      description: adminSeo?.og_description || adminSeo?.description || defaultDesc,
      images: [ogImage],
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
