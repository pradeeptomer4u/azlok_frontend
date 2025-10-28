import axios from 'axios';

export interface NutritionalDetails {
  id: number;
  product_id: number;
  calories: number;
  calories_unit: string;
  protein: number;
  protein_unit: string;
  carbohydrates: number;
  carbohydrates_unit: string;
  total_fat: number;
  total_fat_unit: string;
  fiber: number;
  fiber_unit: string;
  sugar: number | null;
  sugar_unit: string;
  sodium: number;
  sodium_unit: string;
  potassium: number;
  potassium_unit: string;
  calcium: number;
  calcium_unit: string;
  iron: number;
  iron_unit: string;
  magnesium: number | null;
  magnesium_unit: string;
  phosphorus: number | null;
  phosphorus_unit: string;
  zinc: number | null;
  zinc_unit: string;
  vitamin_a: number | null;
  vitamin_a_unit: string;
  vitamin_c: number | null;
  vitamin_c_unit: string;
  vitamin_d: number | null;
  vitamin_d_unit: string;
  vitamin_e: number | null;
  vitamin_e_unit: string;
  vitamin_k: number | null;
  vitamin_k_unit: string;
  thiamin: number | null;
  thiamin_unit: string;
  riboflavin: number | null;
  riboflavin_unit: string;
  niacin: number | null;
  niacin_unit: string;
  vitamin_b6: number | null;
  vitamin_b6_unit: string;
  folate: number | null;
  folate_unit: string;
  vitamin_b12: number | null;
  vitamin_b12_unit: string;
  glycemic_index: number | null;
  antioxidants: string | null;
  allergens: string | null;
  saturated_fat: number;
  saturated_fat_unit: string;
  monounsaturated_fat: number | null;
  monounsaturated_fat_unit: string;
  polyunsaturated_fat: number | null;
  polyunsaturated_fat_unit: string;
  trans_fat: number;
  trans_fat_unit: string;
  cholesterol: number;
  cholesterol_unit: string;
  dietary_fiber: number;
  dietary_fiber_unit: string;
  soluble_fiber: number | null;
  soluble_fiber_unit: string;
  insoluble_fiber: number | null;
  insoluble_fiber_unit: string;
  serving_size: string;
  serving_unit: string;
  notes: string | null;
  health_benefits: string[];
  contraindications: string[];
  source_region: string;
  source_wikipedia: string[];
  source_url: string;
  manufacturing_process: string;
  research_papers: string[];
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azlok.com';

// Interface for schema.org nutrition format
export interface SchemaOrgNutrition {
  servingSize: string;
  calories?: { value: string; unitText: string };
  fatContent?: { value: string; unitText: string };
  saturatedFatContent?: { value: string; unitText: string };
  transFatContent?: { value: string; unitText: string };
  cholesterolContent?: { value: string; unitText: string };
  sodiumContent?: { value: string; unitText: string };
  carbohydrateContent?: { value: string; unitText: string };
  fiberContent?: { value: string; unitText: string };
  sugarContent?: { value: string; unitText: string };
  proteinContent?: { value: string; unitText: string };
}

const nutritionalDetailsService = {
  getNutritionalDetails: async (slug: string): Promise<NutritionalDetails | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/by-slug/${slug}/nutritional-details`);
      const data = response.data;
      
      // Parse string values to numbers
      if (data) {
        const numericFields = [
          'calories', 'protein', 'carbohydrates', 'total_fat', 'fiber',
          'sugar', 'sodium', 'potassium', 'calcium', 'iron', 'magnesium',
          'phosphorus', 'zinc', 'vitamin_a', 'vitamin_c', 'vitamin_d',
          'vitamin_e', 'vitamin_k', 'thiamin', 'riboflavin', 'niacin',
          'vitamin_b6', 'folate', 'vitamin_b12', 'glycemic_index',
          'saturated_fat', 'monounsaturated_fat', 'polyunsaturated_fat',
          'trans_fat', 'cholesterol', 'dietary_fiber', 'soluble_fiber',
          'insoluble_fiber'
        ];
        
        numericFields.forEach(field => {
          if (field in data && data[field] !== null && data[field] !== undefined) {
            // Convert string to number
            data[field] = parseFloat(data[field]);
          }
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching nutritional details:', error);
      return null;
    }
  },
  
  // Convert API nutritional details to schema.org format
  convertToSchemaFormat: (data: NutritionalDetails): SchemaOrgNutrition => {
  
    if (!data) {
      return { servingSize: '100g' };
    }
    
    const result = {
      servingSize: `${data.serving_size}${data.serving_unit}`,
      calories: { value: data.calories.toString(), unitText: data.calories_unit },
      fatContent: { value: data.total_fat.toString(), unitText: data.total_fat_unit },
      saturatedFatContent: { value: data.saturated_fat.toString(), unitText: data.saturated_fat_unit },
      transFatContent: { value: data.trans_fat.toString(), unitText: data.trans_fat_unit },
      cholesterolContent: { value: data.cholesterol.toString(), unitText: data.cholesterol_unit },
      sodiumContent: { value: data.sodium.toString(), unitText: data.sodium_unit },
      carbohydrateContent: { value: data.carbohydrates.toString(), unitText: data.carbohydrates_unit },
      fiberContent: { value: data.dietary_fiber.toString(), unitText: data.dietary_fiber_unit },
      ...(data.sugar !== null ? { sugarContent: { value: data.sugar.toString(), unitText: data.sugar_unit } } : {}),
      proteinContent: { value: data.protein.toString(), unitText: data.protein_unit }
    };
    
    return result;
  }
};

export default nutritionalDetailsService;
