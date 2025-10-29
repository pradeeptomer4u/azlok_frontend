import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.azlok.com';
  const currentDate = new Date();
  
  // Define all routes
  const routes = [
    // Main pages
    { route: '', changeFreq: 'daily', priority: 1.0 },
    { route: '/categories', changeFreq: 'weekly', priority: 0.8 },
    { route: '/products', changeFreq: 'daily', priority: 0.8 },
    
    // Product pages
    { route: '/products/dr-tomar-stearic-acid-powder', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-zeera', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/lavender-essential-oil', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/alum-powder', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/turmeric-haldi-powder-100g', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-kali-mirch-black-pepper-whole', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-saunf-fennel-seeds', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-laung-cloves', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-badi-elaichi-black-cardamom', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-sabut-safed-mirch-white-pepper-whole', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-dal-chini-cinnamon-sticks', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-chhoti-elaichi-green-cardamom', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-dhania-sabut-whole-coriander-seeds', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-tej-patta-bay-leaf', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-badi-elaichi-cardamom', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/glycerine', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/oxalic-acid', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/dr-tomar-borax-powder', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/ipa', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-garam-masala-200-g', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-lal-mirchi-(red-chilli-powder)-100-g', changeFreq: 'daily', priority: 0.8 },
    { route: '/products/azlok-coriander-(dhaniya)-powder-200-g-', changeFreq: 'daily', priority: 0.8 },
    
    // Information pages
    { route: '/about', changeFreq: 'monthly', priority: 0.7 },
    { route: '/contact', changeFreq: 'monthly', priority: 0.7 },
    { route: '/faq', changeFreq: 'monthly', priority: 0.6 },
    { route: '/terms', changeFreq: 'monthly', priority: 0.5 },
    { route: '/privacy', changeFreq: 'monthly', priority: 0.5 },
    { route: '/shipping', changeFreq: 'monthly', priority: 0.5 },
    { route: '/returns', changeFreq: 'monthly', priority: 0.5 },
    { route: '/blog', changeFreq: 'monthly', priority: 0.5 },
    { route: '/blog/borax-powder-helpful-for-human', changeFreq: 'monthly', priority: 0.5 },
    { route: '/product-faqs', changeFreq: 'monthly', priority: 0.6 },
  ];

  return routes.map(({ route, changeFreq, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: changeFreq as 'daily' | 'weekly' | 'monthly',
    priority: priority,
  }));
}
