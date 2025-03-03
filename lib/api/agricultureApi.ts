import axios from 'axios';

// NASA POWER API base URL
const NASA_POWER_BASE_URL = 'https://power.larc.nasa.gov/api/temporal/daily/point';

// FAO Agro API (placeholder - actual implementation would depend on FAO API structure)
const FAO_AGRO_BASE_URL = 'https://api.fao.org/agro';

// Types
export interface SoilData {
  moisture: number;
  temperature: number;
  type?: string;
  ph?: number;
  organicMatter?: number;
}

export interface ClimateData {
  precipitation: number[];
  temperature: {
    min: number[];
    max: number[];
    avg: number[];
  };
  humidity: number[];
  solarRadiation: number[];
  dates: string[];
}

export interface CropRecommendation {
  cropName: string;
  suitability: number; // 0-100
  waterRequirement: string;
  growingSeason: string;
  expectedYield: string;
  notes: string;
}

// Get soil and climate data from NASA POWER API
export const getNASAPowerData = async (
  lat: number, 
  lon: number, 
  startDate: string, 
  endDate: string
): Promise<{ soil: SoilData, climate: ClimateData } | null> => {
  try {
    const parameters = [
      'T2M', // Temperature at 2 Meters
      'T2M_MAX', // Maximum Temperature at 2 Meters
      'T2M_MIN', // Minimum Temperature at 2 Meters
      'PRECTOTCORR', // Precipitation
      'RH2M', // Relative Humidity at 2 Meters
      'ALLSKY_SFC_SW_DWN', // All Sky Surface Shortwave Downward Irradiance
      'SOIL_M_0_10CM', // Soil Moisture at 0-10 cm depth
      'TSOIL0_10CM', // Soil Temperature at 0-10 cm depth
    ].join(',');

    const response = await axios.get(NASA_POWER_BASE_URL, {
      params: {
        parameters,
        community: 'AG',
        longitude: lon,
        latitude: lat,
        start: startDate,
        end: endDate,
        format: 'JSON',
      },
    });

    const data = response.data;
    const timespan = data.properties.parameter;
    
    // Extract dates
    const dates = Object.keys(timespan.T2M);
    
    // Process climate data
    const climate: ClimateData = {
      precipitation: dates.map(date => timespan.PRECTOTCORR[date]),
      temperature: {
        min: dates.map(date => timespan.T2M_MIN[date]),
        max: dates.map(date => timespan.T2M_MAX[date]),
        avg: dates.map(date => timespan.T2M[date]),
      },
      humidity: dates.map(date => timespan.RH2M[date]),
      solarRadiation: dates.map(date => timespan.ALLSKY_SFC_SW_DWN[date]),
      dates,
    };
    
    // Process soil data
    const soil: SoilData = {
      moisture: calculateAverage(dates.map(date => timespan.SOIL_M_0_10CM[date])),
      temperature: calculateAverage(dates.map(date => timespan.TSOIL0_10CM[date])),
    };
    
    return { soil, climate };
  } catch (error) {
    console.error('Error fetching NASA POWER data:', error);
    return null;
  }
};

// Get crop recommendations based on soil and climate data
export const getCropRecommendations = async (
  lat: number, 
  lon: number, 
  soilType?: string
): Promise<CropRecommendation[]> => {
  try {
    // In a real implementation, this would call the FAO Agro API
    // For now, we'll return mock data based on the location
    
    // Get current date and 30 days ago for climate data
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get NASA POWER data for the location
    const powerData = await getNASAPowerData(lat, lon, startDate, endDate);
    
    if (!powerData) {
      return getMockCropRecommendations();
    }
    
    // Use the data to generate recommendations
    // This would be more sophisticated in a real implementation
    const { soil, climate } = powerData;
    
    const avgTemp = calculateAverage(climate.temperature.avg);
    const avgPrecip = calculateAverage(climate.precipitation);
    
    // Generate recommendations based on temperature and precipitation
    const recommendations = generateCropRecommendations(avgTemp, avgPrecip, soil, soilType);
    
    return recommendations;
  } catch (error) {
    console.error('Error getting crop recommendations:', error);
    return getMockCropRecommendations();
  }
};

// Generate crop recommendations based on climate and soil data
const generateCropRecommendations = (
  avgTemp: number, 
  avgPrecip: number, 
  soil: SoilData, 
  soilType?: string
): CropRecommendation[] => {
  const recommendations: CropRecommendation[] = [];
  
  // Rice
  if (avgTemp > 20 && avgPrecip > 5 && soil.moisture > 0.3) {
    recommendations.push({
      cropName: 'Rice',
      suitability: 85,
      waterRequirement: 'High',
      growingSeason: 'Kharif (June-November)',
      expectedYield: '3.5-4.5 tons/hectare',
      notes: 'Suitable for areas with high rainfall and good water retention',
    });
  }
  
  // Wheat
  if (avgTemp < 25 && avgTemp > 10) {
    recommendations.push({
      cropName: 'Wheat',
      suitability: avgTemp < 20 ? 90 : 75,
      waterRequirement: 'Moderate',
      growingSeason: 'Rabi (November-April)',
      expectedYield: '3.0-4.0 tons/hectare',
      notes: 'Requires well-drained soil and moderate temperatures',
    });
  }
  
  // Cotton
  if (avgTemp > 25 && soil.moisture > 0.2) {
    recommendations.push({
      cropName: 'Cotton',
      suitability: 80,
      waterRequirement: 'Moderate',
      growingSeason: 'Kharif (April-November)',
      expectedYield: '1.5-2.5 tons/hectare',
      notes: 'Suitable for areas with long, hot growing seasons',
    });
  }
  
  // Maize
  if (avgTemp > 18 && avgTemp < 30 && avgPrecip > 2) {
    recommendations.push({
      cropName: 'Maize',
      suitability: 85,
      waterRequirement: 'Moderate',
      growingSeason: 'Year-round (varies by region)',
      expectedYield: '4.0-6.0 tons/hectare',
      notes: 'Versatile crop that can be grown in various conditions',
    });
  }
  
  // Pulses (e.g., Chickpea)
  if (avgTemp > 15 && avgTemp < 30 && soil.moisture < 0.4) {
    recommendations.push({
      cropName: 'Chickpea',
      suitability: 75,
      waterRequirement: 'Low to Moderate',
      growingSeason: 'Rabi (October-March)',
      expectedYield: '1.0-1.5 tons/hectare',
      notes: 'Good for crop rotation, improves soil nitrogen',
    });
  }
  
  // Sugarcane
  if (avgTemp > 20 && avgPrecip > 3 && soil.moisture > 0.3) {
    recommendations.push({
      cropName: 'Sugarcane',
      suitability: 80,
      waterRequirement: 'High',
      growingSeason: 'Year-round (12-18 month cycle)',
      expectedYield: '70-100 tons/hectare',
      notes: 'Requires good irrigation facilities and fertile soil',
    });
  }
  
  // Sort by suitability
  recommendations.sort((a, b) => b.suitability - a.suitability);
  
  // Return top 5 recommendations
  return recommendations.slice(0, 5);
};

// Get irrigation recommendations based on crop, soil, and weather
export const getIrrigationRecommendations = async (
  lat: number, 
  lon: number, 
  cropType: string, 
  fieldSize: string
): Promise<any> => {
  try {
    // In a real implementation, this would use more sophisticated models
    // For now, we'll return mock data based on the crop type
    
    // Get current date and 7 days ago for recent weather
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get NASA POWER data for the location
    const powerData = await getNASAPowerData(lat, lon, startDate, endDate);
    
    if (!powerData) {
      return getMockIrrigationRecommendation(cropType, fieldSize);
    }
    
    // Use the data to generate recommendations
    const { soil, climate } = powerData;
    
    // Calculate average precipitation for the last 7 days
    const recentPrecip = calculateAverage(climate.precipitation);
    
    // Generate recommendation based on crop, soil moisture, and recent precipitation
    const recommendation = generateIrrigationRecommendation(
      cropType, 
      fieldSize, 
      soil.moisture, 
      recentPrecip
    );
    
    return recommendation;
  } catch (error) {
    console.error('Error getting irrigation recommendations:', error);
    return getMockIrrigationRecommendation(cropType, fieldSize);
  }
};

// Generate irrigation recommendation
const generateIrrigationRecommendation = (
  cropType: string, 
  fieldSize: string, 
  soilMoisture: number, 
  recentPrecip: number
): any => {
  // Define water requirements for different crops (mm/day)
  const cropWaterRequirements: { [key: string]: number } = {
    'Rice': 8,
    'Wheat': 5,
    'Cotton': 6,
    'Maize': 5.5,
    'Chickpea': 4,
    'Sugarcane': 7,
    'Vegetables': 6,
    'Fruits': 5.5,
    'Pulses': 4,
    'Oilseeds': 4.5,
  };
  
  // Default water requirement if crop not found
  const waterRequirement = cropWaterRequirements[cropType] || 5;
  
  // Adjust based on soil moisture and recent precipitation
  let adjustedRequirement = waterRequirement;
  
  if (soilMoisture > 0.4) {
    adjustedRequirement *= 0.8; // Reduce if soil is already moist
  } else if (soilMoisture < 0.2) {
    adjustedRequirement *= 1.2; // Increase if soil is dry
  }
  
  if (recentPrecip > 5) {
    adjustedRequirement *= 0.7; // Reduce if there has been significant rainfall
  } else if (recentPrecip < 1) {
    adjustedRequirement *= 1.1; // Increase if there has been little rainfall
  }
  
  // Parse field size to calculate total water needed
  const sizeValue = parseFloat(fieldSize);
  const sizeUnit = fieldSize.includes('acre') ? 'acres' : 'hectares';
  const areaInHectares = sizeUnit === 'acres' ? sizeValue * 0.4047 : sizeValue;
  
  // Calculate total water needed (cubic meters)
  const totalWaterNeeded = adjustedRequirement * areaInHectares * 10; // 1mm over 1ha = 10 cubic meters
  
  // Determine next irrigation date
  const today = new Date();
  let daysToNextIrrigation = 1;
  
  if (recentPrecip > 10) {
    daysToNextIrrigation = 4;
  } else if (recentPrecip > 5) {
    daysToNextIrrigation = 2;
  } else if (soilMoisture > 0.4) {
    daysToNextIrrigation = 2;
  }
  
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysToNextIrrigation);
  
  // Format next date
  const nextDateFormatted = nextDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  
  // Determine irrigation frequency
  let frequency = '3-4 days';
  if (waterRequirement > 7) {
    frequency = '2-3 days';
  } else if (waterRequirement < 5) {
    frequency = '4-5 days';
  }
  
  // Generate tips
  const tips = [
    `${cropType} typically requires ${waterRequirement}mm of water per day during this growth stage`,
    'Early morning irrigation reduces water loss due to evaporation',
    'Check soil moisture regularly to adjust irrigation schedule',
  ];
  
  if (soilMoisture < 0.2) {
    tips.push('Consider mulching to help retain soil moisture');
  }
  
  if (recentPrecip > 5) {
    tips.push('Recent rainfall has contributed to soil moisture, adjust irrigation accordingly');
  }
  
  return {
    cropType,
    fieldSize,
    currentStatus: soilMoisture < 0.3 ? 'Soil moisture below optimal levels' : 'Soil moisture at adequate levels',
    recommendation: `Apply approximately ${Math.round(totalWaterNeeded)} cubic meters of water to your ${fieldSize} of ${cropType}`,
    schedule: {
      nextDate: nextDateFormatted,
      frequency,
      amount: `${Math.round(adjustedRequirement)}mm per application`,
    },
    tips,
  };
};

// Get fertilizer recommendations
export const getFertilizerRecommendations = async (
  lat: number, 
  lon: number, 
  cropType: string, 
  fieldSize: string,
  soilType?: string
): Promise<any> => {
  try {
    // In a real implementation, this would use more sophisticated models
    // For now, we'll return mock data based on the crop type
    
    // Get current date and 30 days ago for climate data
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get NASA POWER data for the location
    const powerData = await getNASAPowerData(lat, lon, startDate, endDate);
    
    if (!powerData) {
      return getMockFertilizerRecommendation(cropType, fieldSize);
    }
    
    // Generate recommendation based on crop and soil type
    const recommendation = generateFertilizerRecommendation(
      cropType, 
      fieldSize, 
      soilType || 'Unknown'
    );
    
    return recommendation;
  } catch (error) {
    console.error('Error getting fertilizer recommendations:', error);
    return getMockFertilizerRecommendation(cropType, fieldSize);
  }
};

// Generate fertilizer recommendation
const generateFertilizerRecommendation = (
  cropType: string, 
  fieldSize: string, 
  soilType: string
): any => {
  // Define NPK requirements for different crops (kg/hectare)
  const cropNutrientRequirements: { [key: string]: { N: number, P: number, K: number } } = {
    'Rice': { N: 120, P: 60, K: 60 },
    'Wheat': { N: 120, P: 60, K: 40 },
    'Cotton': { N: 150, P: 60, K: 60 },
    'Maize': { N: 150, P: 75, K: 75 },
    'Chickpea': { N: 20, P: 60, K: 20 },
    'Sugarcane': { N: 250, P: 100, K: 100 },
    'Vegetables': { N: 120, P: 80, K: 80 },
    'Fruits': { N: 100, P: 50, K: 100 },
    'Pulses': { N: 20, P: 50, K: 20 },
    'Oilseeds': { N: 80, P: 40, K: 40 },
  };
  
  // Default nutrient requirement if crop not found
  const nutrientReq = cropNutrientRequirements[cropType] || { N: 100, P: 50, K: 50 };
  
  // Adjust based on soil type
  let adjustedReq = { ...nutrientReq };
  
  if (soilType.toLowerCase().includes('clay')) {
    adjustedReq.P *= 1.2; // Clay soils often bind phosphorus
    adjustedReq.K *= 0.9; // Clay soils often have good potassium
  } else if (soilType.toLowerCase().includes('sandy')) {
    adjustedReq.N *= 1.2; // Sandy soils leach nitrogen quickly
    adjustedReq.K *= 1.2; // Sandy soils often need more potassium
  } else if (soilType.toLowerCase().includes('loam')) {
    // Loam soils are generally balanced
  } else if (soilType.toLowerCase().includes('black')) {
    adjustedReq.N *= 0.9; // Black soils often have good nitrogen
    adjustedReq.P *= 1.1; // May need more phosphorus
  }
  
  // Parse field size to calculate total nutrients needed
  const sizeValue = parseFloat(fieldSize);
  const sizeUnit = fieldSize.includes('acre') ? 'acres' : 'hectares';
  const areaInHectares = sizeUnit === 'acres' ? sizeValue * 0.4047 : sizeValue;
  
  // Calculate total nutrients needed
  const totalN = Math.round(adjustedReq.N * areaInHectares);
  const totalP = Math.round(adjustedReq.P * areaInHectares);
  const totalK = Math.round(adjustedReq.K * areaInHectares);
  
  // Determine next application date
  const today = new Date();
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + 7); // Assuming weekly applications
  
  // Format next date
  const nextDateFormatted = nextDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  
  // Generate fertilizer recommendations
  const ureaAmount = Math.round(totalN * 2.17); // Urea is 46% N
  const dapAmount = Math.round(totalP * 5.56); // DAP is 18% N and 46% P
  const mopAmount = Math.round(totalK * 1.67); // MOP is 60% K
  
  const recommendation = `Apply ${ureaAmount}kg of Urea, ${dapAmount}kg of DAP, and ${mopAmount}kg of MOP for your ${fieldSize} of ${cropType}`;
  
  // Generate tips
  const tips = [
    'Split nitrogen applications to improve efficiency and reduce leaching',
    'Apply fertilizers when soil is moist but not waterlogged',
    'Incorporate fertilizers into the soil rather than surface application when possible',
  ];
  
  if (cropType.toLowerCase().includes('pulse') || cropType.toLowerCase() === 'chickpea') {
    tips.push('Pulses fix atmospheric nitrogen, so they require less nitrogen fertilizer');
  }
  
  if (soilType.toLowerCase().includes('sandy')) {
    tips.push('Sandy soils may require more frequent but smaller fertilizer applications');
  }
  
  return {
    cropType,
    fieldSize,
    currentStatus: 'Soil nutrient levels need to be maintained for optimal growth',
    recommendation,
    schedule: {
      nextDate: nextDateFormatted,
      frequency: 'Apply in split doses throughout the growing season',
      amount: `${totalN}kg N, ${totalP}kg P, ${totalK}kg K total for the season`,
    },
    tips,
  };
};

// Helper function to calculate average of an array of numbers
const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

// Mock data functions
const getMockCropRecommendations = (): CropRecommendation[] => {
  return [
    {
      cropName: 'Rice',
      suitability: 85,
      waterRequirement: 'High',
      growingSeason: 'Kharif (June-November)',
      expectedYield: '3.5-4.5 tons/hectare',
      notes: 'Suitable for areas with high rainfall and good water retention',
    },
    {
      cropName: 'Wheat',
      suitability: 80,
      waterRequirement: 'Moderate',
      growingSeason: 'Rabi (November-April)',
      expectedYield: '3.0-4.0 tons/hectare',
      notes: 'Requires well-drained soil and moderate temperatures',
    },
    {
      cropName: 'Cotton',
      suitability: 75,
      waterRequirement: 'Moderate',
      growingSeason: 'Kharif (April-November)',
      expectedYield: '1.5-2.5 tons/hectare',
      notes: 'Suitable for areas with long, hot growing seasons',
    },
    {
      cropName: 'Maize',
      suitability: 70,
      waterRequirement: 'Moderate',
      growingSeason: 'Year-round (varies by region)',
      expectedYield: '4.0-6.0 tons/hectare',
      notes: 'Versatile crop that can be grown in various conditions',
    },
    {
      cropName: 'Sugarcane',
      suitability: 65,
      waterRequirement: 'High',
      growingSeason: 'Year-round (12-18 month cycle)',
      expectedYield: '70-100 tons/hectare',
      notes: 'Requires good irrigation facilities and fertile soil',
    },
  ];
};

const getMockIrrigationRecommendation = (cropType: string, fieldSize: string): any => {
  return {
    cropType,
    fieldSize,
    currentStatus: 'Soil moisture below optimal levels',
    recommendation: `Apply approximately 500 cubic meters of water to your ${fieldSize} of ${cropType}`,
    schedule: {
      nextDate: 'Tuesday, March 5, 2025',
      frequency: '3-4 days',
      amount: '5mm per application',
    },
    tips: [
      `${cropType} typically requires 5-6mm of water per day during this growth stage`,
      'Early morning irrigation reduces water loss due to evaporation',
      'Check soil moisture regularly to adjust irrigation schedule',
      'Consider mulching to help retain soil moisture',
    ],
  };
};

const getMockFertilizerRecommendation = (cropType: string, fieldSize: string): any => {
  return {
    cropType,
    fieldSize,
    currentStatus: 'Soil nutrient levels need to be maintained for optimal growth',
    recommendation: `Apply 100kg of Urea, 50kg of DAP, and 50kg of MOP for your ${fieldSize} of ${cropType}`,
    schedule: {
      nextDate: 'Monday, March 10, 2025',
      frequency: 'Apply in split doses throughout the growing season',
      amount: '100kg N, 50kg P, 50kg K total for the season',
    },
    tips: [
      'Split nitrogen applications to improve efficiency and reduce leaching',
      'Apply fertilizers when soil is moist but not waterlogged',
      'Incorporate fertilizers into the soil rather than surface application when possible',
      'Conduct soil tests annually to fine-tune fertilizer requirements',
    ],
  };
};