import axios from 'axios';
export const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY!;
import { Coordinate } from '@/types';

// Define types for OpenWeather API Response (minimal)
interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WeatherApiResponse {
  weather: WeatherCondition[];
  main: {
    temp: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  name: string; // location name
}

const BAD_WEATHER_CONDITIONS = ['Rain', 'Thunderstorm', 'Snow'];

export const getWeather = async ({ lat, lng }: Coordinate): Promise<WeatherApiResponse> => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;
    const { data } = await axios.get<WeatherApiResponse>(url);
    return data;
  } catch (error: any) {
    console.error('Error fetching weather data:', error.message);
    throw new Error(`Weather API error: ${error.message}`);
  }
};

export const isBadWeather = (weatherData: WeatherApiResponse): boolean => {
  return weatherData.weather.some(condition => BAD_WEATHER_CONDITIONS.includes(condition.main));
};
