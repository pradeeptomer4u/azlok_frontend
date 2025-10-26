'use client';

import React from 'react';

interface ProductDetailedContentProps {
  productSlug: string;
}

interface ProductContent {
  title: string;
  history: string;
  science: string;
  ayurveda: string;
  modern: string;
  brand: string;
  icon: string;
  category: 'spice' | 'chemical';
}

// Product content database
const productContents: Record<string, ProductContent> = {
  // Spices
  'turmeric-haldi-powder-100g': {
    title: 'Azlok Turmeric (Haldi) Powder',
    history: 'Turmeric, known as Curcuma longa, has its roots in ancient India nearly 4,000 years ago. It was first cultivated in the Indus Valley civilization and used in rituals, food, and medicine. Early Ayurvedic texts like Sushruta Samhita mention "Haridra" for treating skin diseases and infections. Ancient traders carried turmeric along the spice routes to Southeast Asia and the Middle East. Its bright golden hue made it both sacred and symbolic, earning the title "Golden Spice of India."',
    science: 'Modern science identifies curcumin, the active compound in turmeric, as a powerful antioxidant and anti-inflammatory agent. Studies link it to benefits in arthritis, heart health, and immunity enhancement. In Western medicine, turmeric is researched for its potential in reducing inflammation, aiding liver detoxification, and supporting brain function. When combined with black pepper (piperine), its bioavailability increases significantly, making it more effective for daily health.',
    ayurveda: 'In Ayurveda, turmeric is classified as Katu Rasa (pungent) and Tikta Rasa (bitter) with warming energy. It balances Kapha and Vata doshas, purifies blood, and promotes radiant skin. It is used in "Ubtan" (herbal scrubs), healing oils, and golden milk (Haldi Doodh). Ayurvedic healers prescribed it for respiratory issues, digestive health, and wound healing. Even today, a pinch of haldi in milk remains a trusted home remedy across India.',
    modern: 'Turmeric is now a global superfood — used in curries, teas, smoothies, and skincare. It&apos;s valued for its natural coloring, taste, and healing touch. It helps reduce joint pain, improves digestion, and strengthens the immune system. The demand for pure haldi powder online continues to rise due to its versatility in food, beauty, and wellness.',
    brand: 'Azlok Turmeric (Haldi) Powder is made from high-curcumin turmeric roots sourced from certified Indian farms. It&apos;s 100% pure, chemical-free, and ground using low-heat technology to retain its medicinal essence. Every pack is freshness-sealed — delivering aroma, color, and healing benefits straight from nature. Perfect for health-conscious buyers looking to buy pure turmeric powder online.',
    icon: '🌿',
    category: 'spice'
  },
  'azlok-zeera': {
    title: 'Azlok Jeera (Cumin Seeds)',
    history: 'Cumin (Cuminum cyminum) has been a prized spice since ancient Egypt, found in the tombs of Pharaohs as a symbol of preservation and purity. It traveled through the Mediterranean and was recorded in Sanskrit as "Jiraka," meaning "that which helps digestion." The Romans used cumin as a substitute for black pepper, and its trade flourished during the Silk Road era.',
    science: 'Cumin is rich in cuminaldehyde and thymol, compounds that stimulate digestive enzymes and fight bacteria. Modern studies link cumin to improved blood sugar control, antioxidant activity, and iron absorption. It helps reduce bloating and supports gut microbiome health. Scientists also recognize cumin&apos;s mild antimicrobial effects, making it valuable in food preservation.',
    ayurveda: 'In Ayurveda, Jeera is considered a sacred digestive spice. It balances all three doshas — Vata, Pitta, and Kapha — by kindling the digestive fire (Agni). Ayurvedic texts recommend cumin tea for nausea and metabolism enhancement. Roasted cumin powder is used in buttermilk (chaas) and traditional detox drinks.',
    modern: 'Cumin seeds are essential in Indian tempering (tadka). They enhance the aroma and aid digestion when used in dals, curries, and rice. Cumin water (Jeera Pani) is now a trending detox drink that boosts metabolism naturally. The global wellness community recognizes it as a natural digestive superfood.',
    brand: 'Azlok Jeera (Cumin Seeds) are triple-cleaned and graded for premium purity. Each seed bursts with authentic aroma, ensuring freshness in every dish. Packed with care, Azlok Jeera brings home the traditional flavor and modern hygiene — a trusted choice for anyone searching for the best quality cumin seeds online.',
    icon: '🌰',
    category: 'spice'
  },
  'azlok-coriander-(dhaniya)-powder-200-g-': {
    title: 'Azlok Dhania (Coriander) Powder',
    history: 'Coriander (Coriandrum sativum) is one of the oldest herbs known to humanity, cultivated for over 7,000 years. The name originates from the Greek "koris," meaning bedbug, due to its strong aroma. Ancient Egyptians used it for digestion, while Romans believed it preserved meat. In India, coriander has been used since the Vedic period, mentioned in Charaka Samhita for its cooling and detoxifying properties.',
    science: 'Coriander seeds are rich in linalool, borneol, and vitamin C, which support healthy digestion and detoxification. Scientifically, coriander helps reduce cholesterol, blood sugar, and free radical damage. It has mild diuretic and anti-inflammatory effects, making it valuable in herbal medicine. Its calming properties also aid in reducing anxiety and improving sleep.',
    ayurveda: 'In Ayurveda, Dhania is known for its cooling (Sheeta Veerya) energy. It balances Pitta and aids digestion without overheating the body. Coriander water, made by soaking seeds overnight, is used to flush toxins and soothe acidity. Ground coriander is often part of Panch Phoran (five-spice mix) and used to flavor soups, curries, and herbal teas.',
    modern: 'Coriander powder is now a global culinary staple. It adds earthy aroma and a hint of citrus to food. Beyond the kitchen, it supports heart and liver health. Herbalists still recommend coriander for managing cholesterol and soothing inflammation naturally.',
    brand: 'Azlok Coriander (Dhaniya) Powder is freshly milled from premium seeds, retaining essential oils for authentic aroma. It&apos;s 100% pure, with no fillers or additives — making it perfect for those who buy coriander powder online for daily cooking or Ayurvedic cleansing routines.',
    icon: '🌿',
    category: 'spice'
  },
  'azlok-lal-mirchi-(red-chilli-powder)-100-g': {
    title: 'Azlok Lal Mirchi (Red Chilli) Powder',
    history: 'Red chilli (Capsicum annuum) was first cultivated in Central and South America over 6,000 years ago. It was introduced to India by Portuguese traders in the 16th century and quickly became an essential Indian spice. Before chillies, India relied on black pepper for heat — but the arrival of chilli revolutionized Indian cuisine forever. Over centuries, India became one of the world&apos;s largest producers and exporters of red chilli.',
    science: 'The key bioactive compound in chilli is capsaicin, which gives it heat and numerous health benefits. Capsaicin boosts metabolism, improves blood circulation, and releases endorphins — the body&apos;s natural painkillers. Modern medicine also uses chilli extracts in pain relief creams and nasal sprays. Its antioxidant properties help strengthen immunity and heart health.',
    ayurveda: 'In Ayurveda, red chilli is used sparingly due to its strong heating nature (Ushna Veerya). It helps balance Vata and Kapha doshas when used moderately. It enhances appetite, promotes sweating, and improves digestion. In traditional Indian kitchens, chilli was believed to "awaken" the digestive fire (Agni) and remove sluggishness.',
    modern: 'Red chilli powder is now a global kitchen essential — adding flavor, aroma, and color to food. It&apos;s used in curries, pickles, marinades, and snacks. When used in moderation, it aids fat metabolism and supports heart health. Pure chilli powder without added color is preferred by health-conscious consumers looking to avoid artificial additives.',
    brand: 'Azlok Lal Mirchi Powder is made from sun-dried Indian red chillies and ground hygienically with zero added color or preservatives. Its vibrant hue and strong aroma come from nature alone. Perfect for those seeking authentic red chilli powder online with the right balance of heat, purity, and flavor.',
    icon: '🌶️',
    category: 'spice'
  },
  'azlok-garam-masala-200-g': {
    title: 'Azlok Garam Masala',
    history: '"Garam Masala" translates to "hot spice mix," originating from Mughal kitchens and Ayurvedic philosophy. It was crafted as a blend of warming spices that enhanced digestion and preserved food. The concept of spice blending can be traced back to ancient Indian texts where every spice had therapeutic value. Over centuries, Garam Masala evolved regionally — with North Indian, Bengali, and Maharashtrian variations.',
    science: 'The ingredients in Garam Masala — cumin, coriander, black pepper, cinnamon, and cardamom — contain essential oils and antioxidants that support metabolism and immunity. Scientific studies show these spices help regulate blood sugar and cholesterol while offering antimicrobial protection. Regular consumption improves gut health and nutrient absorption.',
    ayurveda: 'Ayurveda regards Garam Masala as a balancing agent that stimulates digestion and maintains body warmth. It pacifies Vata and Kapha doshas and enhances the digestive fire (Agni). Spices like clove and cardamom also aid respiratory wellness, making the blend both culinary and therapeutic.',
    modern: 'Garam Masala is the heart of Indian cooking. It enhances curries, gravies, and roasted dishes with aroma and depth. Beyond taste, it supports natural detoxification, improves circulation, and reduces sluggishness after heavy meals. Global chefs now use Garam Masala in fusion cuisines and health drinks.',
    brand: 'Azlok Garam Masala is crafted from whole, freshly ground spices without fillers. It&apos;s balanced for authentic Indian flavor and potent aroma. Azlok ensures quality and purity in every pack, perfect for those looking to buy premium garam masala online with both flavor and health in mind.',
    icon: '🍛',
    category: 'spice'
  },
  
  // Chemicals
  'alum-powder': {
    title: 'Azlok Alum (Fitkari) Powder',
    history: 'Alum has been known since ancient Greece and India, where it was prized for purification and medicinal use. Archaeological evidence from Egypt shows alum was used for water cleaning and fabric dyeing over 4,000 years ago. In India, Fitkari became a household name for purification rituals, personal care, and healing.',
    science: 'Chemically known as potassium aluminum sulfate, alum has antiseptic, antibacterial, and astringent properties. In medicine, it&apos;s used in styptic pencils for shaving cuts and as a coagulant in water treatment. It helps tighten skin tissues, stop bleeding, and reduce body odor naturally.',
    ayurveda: 'In Ayurveda, Fitkari is known for cleansing and healing. It balances Kapha and Pitta doshas and is used externally for wounds, dental care, and skin tightening. It&apos;s an ancient remedy for mouth ulcers, dandruff, and acne. Alum water gargles were common in traditional Indian households.',
    modern: 'Today, alum remains a multipurpose household essential — used in shaving, skincare, and water purification. It&apos;s eco-friendly, natural, and safe when used in small quantities. Its ability to purify and heal continues to make it relevant even in the modern world.',
    brand: 'Azlok Alum Powder is pure, chemical-free, and finely milled for multipurpose use. Trusted for skincare, oral care, and water purification, it&apos;s the ideal choice for people who buy alum powder online for traditional and modern applications alike.',
    icon: '⚗️',
    category: 'chemical'
  },
  'dr-tomar-borax-powder': {
    title: 'Azlok Borax Powder',
    history: 'Borax, or Sodium Tetraborate, was discovered in the dry lake beds of Tibet around the 8th century. It was traded via the Silk Road to Arabia and later introduced to Europe by Marco Polo. In India, it became known as "Suhaga" — a cleansing and household mineral with multiple uses.',
    science: 'Borax is a natural mineral composed of boron, sodium, oxygen, and water. It acts as a pH buffer, cleaning agent, and preservative. In small doses, it&apos;s used in medicines to treat fungal infections and arthritis. In modern chemistry, it plays a role in glass, ceramics, and enamel production.',
    ayurveda: 'Ayurveda recognizes Suhaga for its detoxifying and balancing effects. It is often purified (Shodhana) before use in formulations that treat skin disorders, indigestion, and joint stiffness. Mixed with honey or ghee, it was traditionally used as a topical antiseptic.',
    modern: 'Borax is a versatile cleaner — ideal for laundry, tiles, and bathroom sanitization. It also acts as a natural pest repellent and DIY slime activator for kids. It&apos;s non-toxic when used properly, making it an eco-friendly home essential.',
    brand: 'Azlok Borax Powder is triple-refined and pure, suitable for multipurpose home use. It&apos;s perfect for people who want a safe, natural cleaning agent and a reliable household product for generations.',
    icon: '🧂',
    category: 'chemical'
  },
  'glycerine': {
    title: 'Azlok Glycerine (Pure & Unscented)',
    history: 'Glycerine was first discovered in 1779 by Swedish chemist Carl Wilhelm Scheele during soap-making experiments. Derived from plant or animal fats, it became a key ingredient in skincare and pharmaceuticals by the 19th century.',
    science: 'Glycerine is a natural humectant, meaning it attracts and retains moisture. In medicine, it&apos;s used in cough syrups, wound healing, and skin hydration. It helps repair the skin barrier, soothe irritation, and prevent dryness. Dermatologists often recommend it for eczema and dry skin.',
    ayurveda: 'Though not native to Ayurveda, glycerine&apos;s properties mirror Sneha (unctuousness) — promoting skin lubrication and healing. It is often used in Ayurvedic cosmetic formulations today for balancing Pitta and restoring softness to dry, overheated skin.',
    modern: 'Pure glycerine is widely used in cosmetics, soaps, creams, and DIY beauty care. It also serves in pharmaceutical formulations, herbal tonics, and natural disinfectants. It&apos;s safe, gentle, and multipurpose — a must-have for skincare enthusiasts.',
    brand: 'Azlok Glycerine is pure, plant-based, and unscented, ideal for beauty and health use. Its gentle formula ensures smooth skin and safe application — the perfect choice for those seeking pure glycerine online.',
    icon: '💧',
    category: 'chemical'
  },
  'oxalic-acid': {
    title: 'Azlok Oxalic Acid Powder',
    history: 'Oxalic acid was discovered in 1776 by Carl Wilhelm Scheele from wood sorrel plants. Later, it was industrially produced from sugar and nitric acid. Its ability to dissolve rust and mineral stains made it a vital household and industrial cleaner.',
    science: 'Oxalic acid acts as a strong organic acid that binds with metal ions, making it useful for cleaning and bleaching. In medicine, it&apos;s studied for its role in calcium metabolism. However, it&apos;s toxic in high amounts and used only externally for cleaning or industrial purposes.',
    ayurveda: 'While not used in classical Ayurveda, the plants containing oxalic compounds (like spinach and sorrel) were known for cleansing the blood and improving digestion in moderation.',
    modern: 'It&apos;s commonly used to remove rust from tools, clean tiles, polish marble, and restore wood. It&apos;s also used in textile dyeing and metal finishing. For safe use, gloves and masks are recommended.',
    brand: 'Azlok Oxalic Acid Powder is high-purity, laboratory-grade, suitable for professional cleaning and industrial use. It&apos;s trusted by both homeowners and craftsmen seeking effective rust remover and surface cleaner.',
    icon: '🧽',
    category: 'chemical'
  },
  'ipa': {
    title: 'Azlok Isopropyl Alcohol (IPA) 99.9% Pure',
    history: 'Isopropyl alcohol was first produced in 1920 by Standard Oil researchers in the USA. Initially used in industrial cleaning, it became essential for laboratories and medicine worldwide due to its sterilizing power.',
    science: 'IPA is a fast-evaporating disinfectant used for sanitizing surfaces, electronics, and skin. It kills bacteria, viruses, and fungi effectively. In healthcare, it&apos;s found in hand rubs, thermometers, and medical wipes.',
    ayurveda: 'IPA itself is a modern compound, but its cleansing role parallels ancient Ayurvedic use of herbal antiseptics like neem or turmeric. Both emphasize purification and hygiene for body and environment.',
    modern: 'It&apos;s used in electronics cleaning, glass maintenance, and first aid. Its quick drying leaves no residue. During pandemics, IPA became a critical household sanitizer.',
    brand: 'Azlok IPA 99.9% Pure is pharma-grade and ideal for safe cleaning, disinfection, and hygiene. It&apos;s the top pick for users wanting pure isopropyl alcohol online that&apos;s effective yet residue-free.',
    icon: '🧴',
    category: 'chemical'
  },
  'dr-tomar-stearic-acid-powder': {
    title: 'Azlok Stearic Acid Powder',
    history: 'Stearic acid was discovered in 1816 by French chemist Michel Eugène Chevreul while studying animal fats. It became vital for making candles, soaps, and cosmetics during the Industrial Revolution.',
    science: 'Stearic acid is a saturated fatty acid that acts as an emulsifier, thickener, and stabilizer in cosmetics and pharmaceuticals. It&apos;s used in creams, lotions, and tablets for consistency and texture. It&apos;s non-toxic and skin-friendly, making it widely approved in modern formulations.',
    ayurveda: 'While not directly in Ayurvedic texts, natural fats and plant butters containing stearic acid were used in healing balms, soaps, and skin protection rituals. They maintain Ojas (vital energy) by nurturing the skin and preventing dryness.',
    modern: 'Used in candle-making, cosmetics, and soap manufacturing, stearic acid adds smoothness and firmness. It&apos;s eco-friendly and biodegradable — ideal for DIY formulators and industrial makers alike.',
    brand: 'Azlok Stearic Acid Powder is premium-grade, vegetable-derived, and 99% pure. Perfect for soap makers, cosmetic formulators, and skincare brands. A favorite among professionals who buy stearic acid online for reliable purity and performance.',
    icon: '🧫',
    category: 'chemical'
  }
};

export default function ProductDetailedContent({ productSlug }: ProductDetailedContentProps) {
  // Get product content based on slug
  const content = productContents[productSlug] || null;
  
  // If no content found for this product
  if (!content) {
    return (
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600 italic">Detailed product information coming soon.</p>
      </div>
    );
  }
  
  const categoryColors = {
    spice: {
      light: 'bg-amber-50',
      border: 'border-amber-200',
      title: 'text-amber-800',
      icon: 'bg-amber-100 text-amber-700'
    },
    chemical: {
      light: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'text-blue-800',
      icon: 'bg-blue-100 text-blue-700'
    }
  };
  
  const colors = categoryColors[content.category];
  
  return (
    <div className="mt-8 space-y-6">
      {/* <div className="flex items-center mb-4">
        <div className={`w-10 h-10 rounded-full ${colors.icon} flex items-center justify-center text-xl mr-3`}>
          {content.icon}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{content.title}</h2>
      </div> */}
      
      {/* History & Discovery */}
      <div className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}>
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">🕰️</span>
          <h3 className={`text-lg font-medium ${colors.title}`}>History & Discovery</h3>
        </div>
        <p className="text-gray-700">{content.history}</p>
      </div>
      
      {/* Scientific & Medicinal Importance */}
      <div className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}>
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">🔬</span>
          <h3 className={`text-lg font-medium ${colors.title}`}>Scientific & Medicinal Importance</h3>
        </div>
        <p className="text-gray-700">{content.science}</p>
      </div>
      
      {/* Ayurvedic and Traditional Uses */}
      <div className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}>
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">🧘</span>
          <h3 className={`text-lg font-medium ${colors.title}`}>Ayurvedic and Traditional Uses</h3>
        </div>
        <p className="text-gray-700">{content.ayurveda}</p>
      </div>
      
      {/* Modern-Day Applications & Benefits */}
      <div className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}>
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">🏠</span>
          <h3 className={`text-lg font-medium ${colors.title}`}>Modern-Day Applications & Benefits</h3>
        </div>
        <p className="text-gray-700">{content.modern}</p>
      </div>
      
      {/* Why Azlok's Version is Trusted Today */}
      <div className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}>
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">🧴</span>
          <h3 className={`text-lg font-medium ${colors.title}`}>Why Azlok&apos;s Version is Trusted Today</h3>
        </div>
        <p className="text-gray-700">{content.brand}</p>
      </div>
    </div>
  );
}
