import axios from 'axios';
import { MODEL_API_ENDPOINT } from '@/utils/constants';
import { Delivery } from '@/types';

// Define the expected response from your AI model
export interface VehicleRecommendation {
  recommended_vehicle: string;
  estimated_cost: number;
  additional_notes?: string;
}

export const getVehicleRecommendations = async (
  deliveries: Delivery[],
  distanceKm: number
): Promise<VehicleRecommendation> => {
  try {
    const payload = { deliveries, distance_km: distanceKm };
    const { data } = await axios.post<VehicleRecommendation>(MODEL_API_ENDPOINT, payload);
    return data;
  } catch (error: any) {
    console.error('Error fetching vehicle recommendations:', error.message);
    throw new Error(`Vehicle Recommendation API error: ${error.message}`);
  }
};
