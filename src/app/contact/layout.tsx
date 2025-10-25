import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us - Azlok",
  description: "Get in touch with Azlok's customer support team. We're here to help with your questions, feedback, and inquiries about our products and services.",
  keywords: "contact azlok, customer support, help, inquiries, feedback, get in touch",
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: "Contact Us - Azlok",
    description: "Get in touch with Azlok's customer support team. We're here to help with your questions, feedback, and inquiries about our products and services.",
    url: '/contact',
    images: ['/logo.png'],
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
