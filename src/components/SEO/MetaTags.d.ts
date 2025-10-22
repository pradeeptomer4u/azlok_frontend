import { FC } from 'react';

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

declare const MetaTags: FC<MetaTagsProps>;

export default MetaTags;
