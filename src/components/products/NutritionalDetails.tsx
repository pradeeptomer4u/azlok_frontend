'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import nutritionalDetailsService from '@/services/nutritionalDetailsService';
import type { NutritionalDetails as NutritionalDetailsType } from '@/services/nutritionalDetailsService';

interface NutritionalDetailsProps {
  slug: string;
  className?: string;
}

const NutritionalDetails: React.FC<NutritionalDetailsProps> = ({ slug, className = '' }) => {
  const [nutritionalData, setNutritionalData] = useState<NutritionalDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllNutrients, setShowAllNutrients] = useState(false);

  useEffect(() => {
    const fetchNutritionalDetails = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await nutritionalDetailsService.getNutritionalDetails(slug);
        setNutritionalData(data);
      } catch (err) {
        console.error('Failed to fetch nutritional details:', err);
        setError('Failed to load nutritional information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNutritionalDetails();
  }, [slug]);

  // If no data found for this product and not loading
  if (!nutritionalData && !isLoading) {
    return null; // Don't render anything if no nutritional data
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className={`mt-8 flex justify-center items-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className={`mt-8 p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Group nutrients for display
  const macronutrients = [
    { name: 'Calories', value: nutritionalData?.calories, unit: nutritionalData?.calories_unit },
    { name: 'Protein', value: nutritionalData?.protein, unit: nutritionalData?.protein_unit },
    { name: 'Carbohydrates', value: nutritionalData?.carbohydrates, unit: nutritionalData?.carbohydrates_unit },
    { name: 'Total Fat', value: nutritionalData?.total_fat, unit: nutritionalData?.total_fat_unit },
    { name: 'Dietary Fiber', value: nutritionalData?.dietary_fiber, unit: nutritionalData?.dietary_fiber_unit },
  ];

  const fatBreakdown = [
    { name: 'Saturated Fat', value: nutritionalData?.saturated_fat, unit: nutritionalData?.saturated_fat_unit },
    { name: 'Monounsaturated Fat', value: nutritionalData?.monounsaturated_fat, unit: nutritionalData?.monounsaturated_fat_unit },
    { name: 'Polyunsaturated Fat', value: nutritionalData?.polyunsaturated_fat, unit: nutritionalData?.polyunsaturated_fat_unit },
    { name: 'Trans Fat', value: nutritionalData?.trans_fat, unit: nutritionalData?.trans_fat_unit },
    { name: 'Cholesterol', value: nutritionalData?.cholesterol, unit: nutritionalData?.cholesterol_unit },
  ];

  const minerals = [
    { name: 'Sodium', value: nutritionalData?.sodium, unit: nutritionalData?.sodium_unit },
    { name: 'Potassium', value: nutritionalData?.potassium, unit: nutritionalData?.potassium_unit },
    { name: 'Calcium', value: nutritionalData?.calcium, unit: nutritionalData?.calcium_unit },
    { name: 'Iron', value: nutritionalData?.iron, unit: nutritionalData?.iron_unit },
    { name: 'Magnesium', value: nutritionalData?.magnesium, unit: nutritionalData?.magnesium_unit },
    { name: 'Phosphorus', value: nutritionalData?.phosphorus, unit: nutritionalData?.phosphorus_unit },
    { name: 'Zinc', value: nutritionalData?.zinc, unit: nutritionalData?.zinc_unit },
  ];

  const vitamins = [
    { name: 'Vitamin A', value: nutritionalData?.vitamin_a, unit: nutritionalData?.vitamin_a_unit },
    { name: 'Vitamin C', value: nutritionalData?.vitamin_c, unit: nutritionalData?.vitamin_c_unit },
    { name: 'Vitamin D', value: nutritionalData?.vitamin_d, unit: nutritionalData?.vitamin_d_unit },
    { name: 'Vitamin E', value: nutritionalData?.vitamin_e, unit: nutritionalData?.vitamin_e_unit },
    { name: 'Vitamin K', value: nutritionalData?.vitamin_k, unit: nutritionalData?.vitamin_k_unit },
    { name: 'Thiamin', value: nutritionalData?.thiamin, unit: nutritionalData?.thiamin_unit },
    { name: 'Riboflavin', value: nutritionalData?.riboflavin, unit: nutritionalData?.riboflavin_unit },
    { name: 'Niacin', value: nutritionalData?.niacin, unit: nutritionalData?.niacin_unit },
    { name: 'Vitamin B6', value: nutritionalData?.vitamin_b6, unit: nutritionalData?.vitamin_b6_unit },
    { name: 'Folate', value: nutritionalData?.folate, unit: nutritionalData?.folate_unit },
    { name: 'Vitamin B12', value: nutritionalData?.vitamin_b12, unit: nutritionalData?.vitamin_b12_unit },
  ];

  // Calculate which nutrients have values for visualization
  const hasValue = (item: { name: string; value: number | null | undefined; unit: string | undefined }) => 
    item.value !== null && item.value !== undefined;
  const macrosWithValues = macronutrients.filter(hasValue);
  const totalMacroValue = macrosWithValues.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-amber-100 relative overflow-hidden ${className}`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-100/20 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-100/20 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-200/0 via-amber-300/50 to-amber-200/0"></div>
      
      {/* Header */}
      <div className="p-6 border-b border-amber-100">
        <h2 className="text-xl font-['Playfair_Display',serif] font-semibold text-amber-800 relative inline-block">
          Nutritional Information
          <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Per {nutritionalData?.serving_size} {nutritionalData?.serving_unit} serving
        </p>
      </div>
      
      {/* All Content Expanded */}
      <div className="p-6">
        {/* Nutrition Facts Section */}
        <div>
          <h3 className="text-lg font-medium text-amber-800 mb-4">Nutrition Facts</h3>
          
          {/* Macronutrient Visualization */}
          <div className="mb-8">
            <h4 className="text-base font-medium text-amber-700 mb-4">Macronutrient Breakdown</h4>
            
            {/* Circular visualization */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Donut chart */}
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="#f7f3eb" />
                  
                  {/* Create pie chart segments */}
                  {macrosWithValues.map((nutrient, index, array) => {
                    // Calculate percentage and position in the circle
                    const percentage = (nutrient.value || 0) / totalMacroValue;
                    let cumulativePercentage = 0;
                    
                    // Sum up percentages of previous segments
                    for (let i = 0; i < index; i++) {
                      cumulativePercentage += (array[i].value || 0) / totalMacroValue;
                    }
                    
                    // Convert percentages to coordinates on the circle
                    const startAngle = cumulativePercentage * 2 * Math.PI - Math.PI/2;
                    const endAngle = (cumulativePercentage + percentage) * 2 * Math.PI - Math.PI/2;
                    
                    // Calculate points on the circle
                    const startX = 50 + 35 * Math.cos(startAngle);
                    const startY = 50 + 35 * Math.sin(startAngle);
                    const endX = 50 + 35 * Math.cos(endAngle);
                    const endY = 50 + 35 * Math.sin(endAngle);
                    
                    // Determine if the arc should be drawn as a large arc
                    const largeArcFlag = percentage > 0.5 ? 1 : 0;
                    
                    // Colors for different nutrients
                    const colors = [
                      '#f59e0b', // amber-500 - Calories
                      '#10b981', // emerald-500 - Protein
                      '#6366f1', // indigo-500 - Carbs
                      '#f97316', // orange-500 - Fat
                      '#8b5cf6', // violet-500 - Fiber
                    ];
                    
                    return (
                      <path
                        key={nutrient.name}
                        d={`M 50 50 L ${startX} ${startY} A 35 35 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                        fill={colors[index % colors.length]}
                        opacity="0.8"
                      />
                    );
                  })}
                  
                  {/* Inner circle for donut effect */}
                  <circle cx="50" cy="50" r="20" fill="white" />
                </svg>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-1 gap-2">
                {macrosWithValues.map((nutrient, index) => {
                  // Colors matching the chart segments
                  const colors = [
                    'bg-amber-500', // Calories
                    'bg-emerald-500', // Protein
                    'bg-indigo-500', // Carbs
                    'bg-orange-500', // Fat
                    'bg-violet-500', // Fiber
                  ];
                  
                  const percentage = ((nutrient.value || 0) / totalMacroValue * 100).toFixed(1);
                  
                  return (
                    <div key={nutrient.name} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]} mr-2`}></div>
                      <span className="text-gray-700">{nutrient.name}</span>
                      <span className="ml-auto text-gray-900 font-medium">
                        {nutrient.value} {nutrient.unit} ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Detailed Nutrition Table */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-amber-700 mb-4">Detailed Nutrition Facts</h4>
            
            <div className="border border-amber-200 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
                <div className="grid grid-cols-2">
                  <div className="font-medium text-amber-900">Nutrient</div>
                  <div className="font-medium text-amber-900 text-right">Amount</div>
                </div>
              </div>
              
              {/* Macronutrients */}
              <div className="px-4 py-3 border-b border-amber-100 bg-white">
                <div className="font-medium text-amber-800 mb-2">Macronutrients</div>
                {macronutrients.map((nutrient) => (
                  nutrient.value !== null && nutrient.value !== undefined && (
                    <div key={nutrient.name} className="grid grid-cols-2 py-1">
                      <div className="text-gray-700">{nutrient.name}</div>
                      <div className="text-right text-gray-900">
                        {nutrient.value} {nutrient.unit}
                      </div>
                    </div>
                  )
                ))}
              </div>
              
              {/* Fat Breakdown */}
              <div className="px-4 py-3 border-b border-amber-100 bg-amber-50/30">
                <div className="font-medium text-amber-800 mb-2">Fat Breakdown</div>
                {fatBreakdown.map((nutrient) => (
                  nutrient.value !== null && nutrient.value !== undefined && (
                    <div key={nutrient.name} className="grid grid-cols-2 py-1">
                      <div className="text-gray-700">{nutrient.name}</div>
                      <div className="text-right text-gray-900">
                        {nutrient.value} {nutrient.unit}
                      </div>
                    </div>
                  )
                ))}
              </div>
              
              {/* Show more/less button */}
              <button
                onClick={() => setShowAllNutrients(!showAllNutrients)}
                className="w-full px-4 py-2 text-amber-700 hover:bg-amber-50 transition-colors duration-300 flex items-center justify-center border-b border-amber-100"
              >
                {showAllNutrients ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    Show More Nutrients
                  </>
                )}
              </button>
              
              {/* Additional nutrients (shown when expanded) */}
              {showAllNutrients && (
                <>
                  {/* Minerals */}
                  <div className="px-4 py-3 border-b border-amber-100 bg-white">
                    <div className="font-medium text-amber-800 mb-2">Minerals</div>
                    {minerals.map((nutrient) => (
                      nutrient.value !== null && nutrient.value !== undefined && (
                        <div key={nutrient.name} className="grid grid-cols-2 py-1">
                          <div className="text-gray-700">{nutrient.name}</div>
                          <div className="text-right text-gray-900">
                            {nutrient.value} {nutrient.unit}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                  
                  {/* Vitamins */}
                  <div className="px-4 py-3 bg-amber-50/30">
                    <div className="font-medium text-amber-800 mb-2">Vitamins</div>
                    {vitamins.map((nutrient) => (
                      nutrient.value !== null && nutrient.value !== undefined && (
                        <div key={nutrient.name} className="grid grid-cols-2 py-1">
                          <div className="text-gray-700">{nutrient.name}</div>
                          <div className="text-right text-gray-900">
                            {nutrient.value} {nutrient.unit}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Notes */}
            {nutritionalData?.notes && (
              <div className="mt-4 bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start">
                <Info size={18} className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{nutritionalData.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-amber-100 my-8"></div>
        
        {/* Source & Process Section */}
        <div>
          <h3 className="text-lg font-medium text-amber-800 mb-4">Source & Process</h3>
          
          {/* Source Region */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-amber-700 mb-3">Source Region</h4>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <p className="text-gray-700">{nutritionalData?.source_region}</p>
              
              {/* Source links */}
              {nutritionalData?.source_wikipedia && nutritionalData.source_wikipedia.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Learn more about the region:</p>
                  <div className="flex flex-wrap gap-2">
                    {nutritionalData.source_wikipedia.map((link, index) => (
                      <a 
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-amber-700 hover:text-amber-800 text-sm bg-white px-3 py-1 rounded-full border border-amber-200 hover:border-amber-300 transition-colors duration-300"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Wikipedia {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Manufacturing Process */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-amber-700 mb-3">Manufacturing Process</h4>
            <div className="bg-white rounded-lg p-4 border border-amber-100">
              <p className="text-gray-700">{nutritionalData?.manufacturing_process}</p>
            </div>
          </div>
          
          {/* Research Papers */}
          {nutritionalData?.research_papers && nutritionalData.research_papers.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-amber-700 mb-3">Research & Studies</h4>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <p className="text-sm text-gray-600 mb-2">Scientific research related to this product:</p>
                <ul className="space-y-2">
                  {nutritionalData.research_papers.map((paper, index) => (
                    <li key={index}>
                      <a 
                        href={paper}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-amber-700 hover:text-amber-800 hover:underline text-sm"
                      >
                        <ExternalLink size={14} className="mr-1 flex-shrink-0" />
                        {paper.split('/').pop()?.replace(/-/g, ' ').substring(0, 50)}...
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Divider */}
        <div className="border-t border-amber-100 my-8"></div>
        
        {/* Health Benefits Section */}
        <div>
          <h3 className="text-lg font-medium text-amber-800 mb-4">Health Benefits</h3>
          
          {/* Health Benefits */}
          {nutritionalData?.health_benefits && nutritionalData.health_benefits.length > 0 && (
            <div className="mb-6">
              <h4 className="text-base font-medium text-amber-700 mb-3">Benefits</h4>
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg p-4 border border-amber-100">
                <ul className="space-y-3">
                  {nutritionalData.health_benefits.map((benefit, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      </div>
                      <span className="ml-2 text-gray-700">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Antioxidants */}
          {nutritionalData?.antioxidants && (
            <div className="mb-6">
              <h4 className="text-base font-medium text-amber-700 mb-3">Antioxidant Properties</h4>
              <div className="bg-white rounded-lg p-4 border border-amber-100">
                <p className="text-gray-700">{nutritionalData.antioxidants}</p>
              </div>
            </div>
          )}
          
          {/* Contraindications */}
          {nutritionalData?.contraindications && nutritionalData.contraindications.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-amber-700 mb-3">Contraindications & Warnings</h4>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <ul className="space-y-2">
                  {nutritionalData.contraindications.map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <Info size={16} className="text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionalDetails;
