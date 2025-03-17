import type { NextApiRequest, NextApiResponse } from 'next';
import { Coordinate, Destination } from '@/types';
import { clusterDestinations } from '@/utils/logisticsHelpers';
import { getIndividualRoute, getRoute } from '@/services/googleMapService';
import { getWeather, isBadWeather } from '@/services/weatherService';
import { getVehicleRecommendations } from '@/services/vehicleService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { start, destinations } = req.body as { start: Coordinate; destinations: Destination[] };
  
      if (!start || !destinations.length) {
        return res.status(400).json({ error: "Invalid input" });
      }
  
      let responseData: any;
  
      if (destinations.length === 1) {
        const route = await getIndividualRoute(start, destinations[0]);
        const weather = await getWeather(destinations[0]);
        const vehicles = await getVehicleRecommendations(destinations[0].deliveries, route.distanceKm);
        responseData = {
          type: "individual",
          destination: destinations[0],
          route,
          weather,
          vehicles,
        };
      } else {
        const groups = clusterDestinations(destinations);
        const groupedRoutes = await Promise.all(
          groups.map(async (group, index) => {
            const route = group.length > 1
              ? await getRoute(start, group)
              : await getIndividualRoute(start, group[0]);
  
            const weather = await Promise.all(group.map(getWeather));
            const allDeliveries = group.flatMap(dest => dest.deliveries);
  
            // ✅ Solve your error here explicitly:
            const distance = 'totalDistanceKm' in route ? route.totalDistanceKm : route.distanceKm;
  
            const vehicles = await getVehicleRecommendations(allDeliveries, distance);
  
            return {
              groupId: index + 1,
              destinations: group,
              route,
              weather,
              vehicles,
            };
          })
        );
        responseData = { groupedRoutes };
      }
  
      return res.json(responseData);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
  
