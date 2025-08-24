import { FC } from 'react';

interface OrganizationStructuredDataProps {
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}

export const OrganizationStructuredData: FC<OrganizationStructuredDataProps>;

interface ProductStructuredDataProps {
  name: string;
  description: string;
  image: string;
  sku: string;
  brand: string;
  price: number;
  currency?: string;
  availability?: string;
  reviewCount?: number;
  reviewRating?: number;
}

export const ProductStructuredData: FC<ProductStructuredDataProps>;
