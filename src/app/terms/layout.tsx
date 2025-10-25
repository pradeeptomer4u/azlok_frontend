import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service - Azlok",
  description: "Read Azlok's terms of service, including user agreements, purchase terms, and platform usage policies.",
  keywords: "terms of service, user agreement, terms and conditions, legal, policy, usage terms",
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: "Terms of Service - Azlok",
    description: "Read Azlok's terms of service, including user agreements, purchase terms, and platform usage policies.",
    url: '/terms',
    images: ['/logo.png'],
    type: 'website',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}