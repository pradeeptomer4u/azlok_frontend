'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQSchema } from '../SEO';

// Define the FAQ data structure
interface FAQ {
  question: string;
  answer: string;
}

// Define the product-specific FAQ mapping
const productFAQs: Record<string, FAQ[]> = {
  // Spices
  'turmeric': [
    {
      question: "What makes Azlok Turmeric (Haldi) different from regular turmeric powder?",
      answer: "Azlok Haldi is made from high-curcumin turmeric roots that offer deeper color, stronger aroma, and better anti-inflammatory benefits compared to regular market turmeric."
    },
    {
      question: "How can I use Azlok Turmeric Powder daily?",
      answer: "You can add it to curries, milk (haldi doodh), smoothies, or skincare masks for natural glow and immunity support."
    },
    {
      question: "Why is turmeric considered good for health?",
      answer: "Turmeric contains curcumin, a natural antioxidant that helps reduce inflammation, boost immunity, and promote skin health."
    },
    {
      question: "Can I use this turmeric for skincare?",
      answer: "Yes, Azlok Turmeric is pure and chemical-free, making it safe for DIY face packs and tan removal masks."
    },
    {
      question: "How should I store turmeric powder for long freshness?",
      answer: "Keep it in an airtight jar away from sunlight and moisture to maintain its rich color and aroma."
    }
  ],
  'zeera': [
    {
      question: "What makes Azlok Jeera premium quality?",
      answer: "Our cumin seeds are sourced from the best Indian farms and cleaned multiple times to ensure strong aroma and authentic flavor."
    },
    {
      question: "How can I use cumin seeds in daily cooking?",
      answer: "Jeera can be tempered in oil for curries, dal, and vegetables, or roasted for raita, masala rice, and snacks."
    },
    {
      question: "Why is cumin important for digestion?",
      answer: "Cumin contains natural digestive enzymes that improve metabolism and reduce bloating."
    },
    {
      question: "Can cumin water help with weight management?",
      answer: "Yes, drinking boiled cumin water on an empty stomach helps detoxify and support fat metabolism naturally."
    },
    {
      question: "How do I store cumin seeds to retain freshness?",
      answer: "Store in an airtight container in a cool, dry place away from humidity and direct sunlight."
    }
  ],
  'coriander': [
    {
      question: "What makes Azlok Coriander Powder unique?",
      answer: "Azlok uses freshly ground coriander seeds to preserve the natural aroma, flavor, and essential oils."
    },
    {
      question: "How can I use coriander powder in recipes?",
      answer: "Add it to curries, lentils, vegetables, and soups for a mild earthy flavor that balances spice."
    },
    {
      question: "Why is coriander considered cooling for the body?",
      answer: "Coriander helps regulate body temperature and promotes digestion, making it ideal for summer cooking."
    },
    {
      question: "Can I use coriander powder for skincare?",
      answer: "Yes, it's rich in antioxidants that help clear acne and improve complexion when used in face packs."
    },
    {
      question: "How should coriander powder be stored?",
      answer: "Store in a dry, airtight jar away from heat and sunlight to prevent loss of flavor."
    }
  ],
  'chilli': [
    {
      question: "What makes Azlok Lal Mirchi stand out?",
      answer: "It's made from 100% sun-dried red chillies, ground hygienically without added colors or preservatives."
    },
    {
      question: "How can I use red chilli powder in cooking?",
      answer: "Use it to enhance the flavor and color of curries, marinades, snacks, and pickles."
    },
    {
      question: "Why is red chilli powder good for metabolism?",
      answer: "Capsaicin, the natural compound in chillies, helps boost metabolism and supports fat burning."
    },
    {
      question: "Can I use this chilli powder for seasoning snacks?",
      answer: "Yes, sprinkle it over pakoras, popcorn, or roasted nuts for a spicy kick."
    },
    {
      question: "How do I reduce the heat level if it's too spicy?",
      answer: "Mix it with ghee, curd, or tomato puree to balance the spice intensity."
    }
  ],
  'garam-masala': [
    {
      question: "What ingredients are used in Azlok Garam Masala?",
      answer: "It contains premium Indian spices like cumin, coriander, cardamom, cinnamon, cloves, and pepper blended to perfection."
    },
    {
      question: "How can I use Garam Masala effectively?",
      answer: "Add it at the end of cooking for maximum aroma and authentic North Indian taste."
    },
    {
      question: "Why is Garam Masala an essential Indian spice?",
      answer: "It enhances flavor, adds warmth, and balances the spice profile of any dish."
    },
    {
      question: "Can I use it for vegetarian and non-vegetarian dishes?",
      answer: "Absolutely! It's perfect for curries, gravies, paneer dishes, and chicken recipes alike."
    },
    {
      question: "How do I preserve Garam Masala's freshness?",
      answer: "Store in an airtight container and avoid exposing it to moisture or direct sunlight."
    }
  ],
  
  // Chemicals
  'alum': [
    {
      question: "What is Azlok Alum Powder used for?",
      answer: "Alum is used for water purification, shaving cuts, oral care, and skin tightening."
    },
    {
      question: "How can I use alum for skincare?",
      answer: "Mix a pinch of alum powder with rose water and apply on acne or oily skin for tightening and antibacterial benefits."
    },
    {
      question: "Why is alum used in water purification?",
      answer: "It removes suspended particles and kills bacteria, making drinking water clear and safe."
    },
    {
      question: "Can alum help with bad odor or sweat?",
      answer: "Yes, alum acts as a natural deodorant due to its antiseptic and odor-control properties."
    },
    {
      question: "Is Azlok Alum safe for regular use?",
      answer: "When used externally or for water purification in recommended amounts, it's completely safe and effective."
    }
  ],
  'borax': [
    {
      question: "What are the common uses of Azlok Borax Powder?",
      answer: "It's a natural cleaner, laundry booster, slime activator, and pest control agent."
    },
    {
      question: "How can I use Borax for cleaning at home?",
      answer: "Mix with warm water to clean tiles, bathrooms, and laundry stains effectively."
    },
    {
      question: "Why is Borax considered eco-friendly?",
      answer: "It's biodegradable and non-toxic when used properly, making it safer than harsh chemical cleaners."
    },
    {
      question: "Can Borax be used in slime-making?",
      answer: "Yes, it acts as a natural activator to give slime the perfect stretch and texture."
    },
    {
      question: "How should Borax be stored safely?",
      answer: "Keep it in a sealed container away from children and moisture."
    }
  ],
  'glycerine': [
    {
      question: "What is Azlok Glycerine used for?",
      answer: "It's a natural moisturizer used in skincare, soap-making, and household cleaning."
    },
    {
      question: "How does glycerine benefit the skin?",
      answer: "It locks in moisture, softens dry skin, and creates a smooth, hydrated texture."
    },
    {
      question: "Why is pure glycerine preferred over synthetic ones?",
      answer: "Pure glycerine is gentle, non-toxic, and free from artificial additives or alcohol."
    },
    {
      question: "Can glycerine be used for DIY beauty products?",
      answer: "Yes, it's ideal for making face toners, creams, and hair serums at home."
    },
    {
      question: "How should glycerine be stored?",
      answer: "Store it in a cool, dark place away from direct sunlight."
    }
  ],
  'oxalic': [
    {
      question: "What is Oxalic Acid used for?",
      answer: "It's a powerful cleaning agent used to remove rust, stains, and mineral deposits."
    },
    {
      question: "How can I use Oxalic Acid safely?",
      answer: "Always wear gloves, dilute in water, and use in well-ventilated areas."
    },
    {
      question: "Why is Oxalic Acid effective for rust removal?",
      answer: "It reacts chemically with rust and converts it into a water-soluble compound."
    },
    {
      question: "Can Oxalic Acid be used on marble or granite?",
      answer: "No, it's too strong and may damage natural stone surfaces."
    },
    {
      question: "How should Oxalic Acid be stored?",
      answer: "Store in a tightly sealed container, away from children and moisture."
    }
  ],
  'ipa': [
    {
      question: "What is Azlok Isopropyl Alcohol used for?",
      answer: "It's a fast-evaporating disinfectant for electronics, glass, and household surfaces."
    },
    {
      question: "How do I use IPA for cleaning electronics?",
      answer: "Apply with a microfiber cloth to remove fingerprints, dirt, and oils safely."
    },
    {
      question: "Why is 99.9% purity important in IPA?",
      answer: "Higher purity ensures faster drying and zero residue after cleaning."
    },
    {
      question: "Can IPA be used for sanitizing hands?",
      answer: "Yes, it's effective when diluted to 70% concentration for hand sanitization."
    },
    {
      question: "Is Isopropyl Alcohol flammable?",
      answer: "Yes, it's highly flammable. Keep away from heat, sparks, and open flames."
    }
  ],
  'stearic': [
    {
      question: "What is Stearic Acid used for?",
      answer: "It's used in cosmetics, soaps, candles, and pharmaceuticals as an emulsifier and thickener."
    },
    {
      question: "How does Stearic Acid help in skincare?",
      answer: "It provides a smooth, creamy texture in lotions and protects skin moisture barriers."
    },
    {
      question: "Why is Stearic Acid essential in soap-making?",
      answer: "It adds hardness and stability to soaps, improving lather quality."
    },
    {
      question: "Can Stearic Acid be used for candles?",
      answer: "Yes, it strengthens wax, giving candles a longer burn time and better structure."
    },
    {
      question: "How should Stearic Acid Powder be stored?",
      answer: "Keep it in a cool, dry place, tightly sealed to avoid moisture clumping."
    }
  ]
};

// Map product slugs to their respective FAQ keys
const productSlugToFAQKey: Record<string, string> = {
  'turmeric-haldi-powder-100g': 'turmeric',
  'azlok-zeera': 'zeera',
  'azlok-coriander-(dhaniya)-powder-200-g-': 'coriander',
  'azlok-lal-mirchi-(red-chilli-powder)-100-g': 'chilli',
  'azlok-garam-masala-200-g': 'garam-masala',
  'alum-powder': 'alum',
  'dr-tomar-borax-powder': 'borax',
  'glycerine': 'glycerine',
  'oxalic-acid': 'oxalic',
  'ipa': 'ipa',
  'dr-tomar-stearic-acid-powder': 'stearic'
};

// Product display names for titles
const productDisplayNames: Record<string, string> = {
  'turmeric': 'Azlok Turmeric (Haldi) Powder',
  'zeera': 'Azlok Jeera (Cumin Seeds)',
  'coriander': 'Azlok Coriander (Dhaniya) Powder',
  'chilli': 'Azlok Red Chilli (Lal Mirchi) Powder',
  'garam-masala': 'Azlok Garam Masala',
  'alum': 'Azlok Alum (Fitkari) Powder',
  'borax': 'Azlok Borax Powder',
  'glycerine': 'Azlok Glycerine',
  'oxalic': 'Azlok Oxalic Acid',
  'ipa': 'Azlok Isopropyl Alcohol (IPA)',
  'stearic': 'Azlok Stearic Acid Powder'
};

// Product category for styling
const productCategories: Record<string, 'spice' | 'chemical'> = {
  'turmeric': 'spice',
  'zeera': 'spice',
  'coriander': 'spice',
  'chilli': 'spice',
  'garam-masala': 'spice',
  'alum': 'chemical',
  'borax': 'chemical',
  'glycerine': 'chemical',
  'oxalic': 'chemical',
  'ipa': 'chemical',
  'stearic': 'chemical'
};

// Product background patterns
const backgroundPatterns: Record<string, string> = {
  'spice': "bg-[url('/images/spice-pattern.svg')]",
  'chemical': "bg-[url('/images/chemical-pattern.svg')]"
};

// Product accent colors
const accentColors: Record<string, { light: string, medium: string, dark: string }> = {
  'spice': {
    light: 'from-amber-100 to-amber-50',
    medium: 'from-amber-500 to-amber-600',
    dark: 'from-amber-700 to-amber-800'
  },
  'chemical': {
    light: 'from-blue-100 to-blue-50',
    medium: 'from-blue-500 to-blue-600',
    dark: 'from-blue-700 to-blue-800'
  }
};

// Product icons (using emoji as placeholders - in a real implementation you'd use SVGs)
const productIcons: Record<string, React.ReactNode> = {
  'turmeric': '🟡',
  'zeera': '🌱',
  'coriander': '🌿',
  'chilli': '🌶️',
  'garam-masala': '✨',
  'alum': '💎',
  'borax': '🧪',
  'glycerine': '💧',
  'oxalic': '🧼',
  'ipa': '🧴',
  'stearic': '🕯️'
};

interface ProductFAQProps {
  product: string;
  slug?: string;
  showSchema?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
}

const ProductFAQ: React.FC<ProductFAQProps> = ({ 
  product, 
  slug, 
  showSchema = true,
  className = '',
  title,
  subtitle
}) => {
  // All questions are open by default
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2, 3, 4]);
  
  // Determine which product key to use
  const productKey = productSlugToFAQKey[product] || product;
  
  // Get FAQs for this product
  const faqs = productFAQs[productKey] || [];
  
  // Get product category and styling
  const category = productCategories[productKey] || 'spice';
  const bgPattern = backgroundPatterns[category];
  const colors = accentColors[category];
  const productName = productDisplayNames[productKey] || 'Product';
  const icon = productIcons[productKey] || '❓';
  
  // For schema generation
  const productUrl = slug 
    ? `https://www.azlok.com/products/${slug}`
    : `https://www.azlok.com/products/${product}`;
    
  // Toggle FAQ item
  const toggleFAQ = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter(i => i !== index));
    } else {
      setOpenIndices([...openIndices, index]);
    }
  };

  // If no FAQs found
  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Background to match tabs section exactly */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden"></div>
      
      {/* Content container */}
      <div className="relative z-10">
        {/* Header - only shown if title is provided */}
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h2 className="text-xl md:text-2xl font-bold text-green-800">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        )}
        
        {/* FAQ List - Styled to match the tab section exactly */}
        <div className="space-y-6 px-6 py-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="mb-10 last:mb-0"
            >
              <div className="flex">
                <div className="flex-shrink-0 mt-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-green-600 font-['Montserrat',sans-serif]">
                    {faq.question}
                  </h3>
                  <div className="mt-2">
                    <p className="text-gray-700 font-['Montserrat',sans-serif] font-light text-lg leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Add JSON-LD Schema */}
      {showSchema && (
        <FAQSchema 
          faqs={faqs.map(faq => ({
            question: faq.question,
            answer: faq.answer
          }))}
          url={productUrl}
        />
      )}
    </div>
  );
};

export default ProductFAQ;
