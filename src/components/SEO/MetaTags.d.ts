import { FC } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

declare const MetaTags: FC<MetaTagsProps>;

export default MetaTags;
