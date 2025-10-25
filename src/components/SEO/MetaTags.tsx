import React from 'react';
import Head from 'next/head';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: string;
  ogUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords = 'marketplace, online shopping, ecommerce',
  ogType = 'website',
  ogUrl,
  ogTitle,
  ogDescription,
  ogImage = '/logo.png',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage = '/logo.png',
  canonicalUrl,
}) => {
  // Use provided values or fallback to defaults
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalTwitterTitle = twitterTitle || title;
  const finalTwitterDescription = twitterDescription || description;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
<link rel="canonical" href={canonicalUrl ? `https://azlok.com${canonicalUrl}` : 'https://azlok.com'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage.startsWith('http') ? ogImage : `https://azlok.com${ogImage}`} />
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      {ogUrl && <meta property="twitter:url" content={ogUrl} />}
      <meta property="twitter:title" content={finalTwitterTitle} />
      <meta property="twitter:description" content={finalTwitterDescription} />
      <meta property="twitter:image" content={twitterImage} />
    </Head>
  );
};

export default MetaTags;
