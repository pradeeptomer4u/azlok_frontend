import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy - Azlok",
  description: "Learn about Azlok's privacy policy, how we collect, use, and protect your personal information.",
  keywords: "privacy policy, data protection, personal information, cookies, GDPR, privacy rights",
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: "Privacy Policy - Azlok",
    description: "Learn about Azlok's privacy policy, how we collect, use, and protect your personal information.",
    url: '/privacy',
    images: ['/logo.png'],
    type: 'website',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}