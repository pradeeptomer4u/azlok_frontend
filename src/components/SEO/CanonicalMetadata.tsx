'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

interface CanonicalMetadataProps {
  customPath?: string;
  domain?: string;
}

/**
 * Client component that adds the canonical URL using a script tag
 * This is a workaround for dynamic canonical URLs in Next.js App Router
 */
export default function CanonicalMetadata({ 
  customPath, 
  domain = 'https://www.azlok.com' 
}: CanonicalMetadataProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // Only run on client-side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  // Use custom path if provided, otherwise use the current pathname
  const canonicalPath = customPath || pathname || '';
  
  // Construct the full canonical URL
  const canonicalUrl = `${domain}${canonicalPath}`;
  
  // Script to update canonical URL
  const scriptContent = `
    (function() {
      // Remove any existing canonical links
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.remove();
      }
      
      // Create and add the new canonical link
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = '${canonicalUrl}';
      document.head.appendChild(link);
    })();
  `;
  
  return (
    <Script id="canonical-script" strategy="afterInteractive">
      {scriptContent}
    </Script>
  );
}
