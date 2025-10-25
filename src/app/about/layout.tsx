import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us - Azlok",
  description: "Learn about Azlok's mission, values, and commitment to providing premium online shopping experiences with quality products and exceptional service.",
  keywords: "about azlok, company, mission, vision, values, team, premium shopping, e-commerce",
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: "About Us - Azlok",
    description: "Learn about Azlok's mission, values, and commitment to providing premium online shopping experiences with quality products and exceptional service.",
    url: '/about',
    images: ['/logo.png'],
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
