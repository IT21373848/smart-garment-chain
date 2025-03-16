import axios from 'axios';
import { Coordinate, Destination } from '@/types';
import { OPENROUTESERVICE_API_KEY } from '@/utils/constants';

export const calculateRouteDistance = async (start: Coordinate, destination: Coordinate): Promise<number> => {
  const url = "https://api.openrouteservice.org/v2/matrix/driving-car";
  const payload = {
    locations: [[start.lng, start.lat], [destination.lng, destination.lat]],
    metrics: ["distance"],
    units: "km"
  };
  const headers = { "Authorization": OPENROUTESERVICE_API_KEY };
  const { data } = await axios.post(url, payload, { headers });
  return data.distances[0][1];
};

export const getRoute = async (start: Coordinate, destinations: Destination[]) => {
  const coordinates = [
    [start.lng, start.lat],
    ...destinations.map(dest => [dest.lng, dest.lat])
  ];

  const url = "https://api.openrouteservice.org/v2/directions/driving-car";
  const headers = { "Authorization": OPENROUTESERVICE_API_KEY };
  const payload = { coordinates };

  const { data } = await axios.post(url, payload, { headers });

  const totalDistanceKm = data.routes[0].summary.distance / 1000;

  const waypoints = destinations.slice(0, -1).map(dest => `${dest.lat},${dest.lng}`).join('|');
  const finalDestination = destinations[destinations.length - 1];

  const routeLink = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${finalDestination.lat},${finalDestination.lng}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=driving`;

  return { totalDistanceKm, routeLink };
};

export const getIndividualRoute = async (start: Coordinate, destination: Destination) => {
  const distanceKm = await calculateRouteDistance(start, destination);
  const routeLink = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
  return { distanceKm, routeLink };
};
