import { NextResponse } from 'next/server';
import { clusterDestinations } from '@/utils/logisticsHelpers';
import { getIndividualRoute, getRoute } from '@/services/googleMapService';
import { getWeather } from '@/services/weatherService';
import { getVehicleRecommendations } from '@/services/vehicleService';
import { Coordinate, Destination } from '@/types';

export async function POST(request: Request) {
  try {
    const { start, destinations } = (await request.json()) as {
      start: Coordinate;
      destinations: Destination[];
    };

    if (!start || !destinations.length) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    let responseData: any;

    if (destinations.length === 1) {
      const route = await getIndividualRoute(start, destinations[0]);
      const weather = await getWeather(destinations[0]);
      const vehicles = await getVehicleRecommendations(destinations[0].deliveries, route.distanceKm);
      responseData = {
        type: 'individual',
        destination: destinations[0],
        route,
        weather,
        vehicles,
      };
    } else {
      const groups = clusterDestinations(destinations);
      const groupedRoutes = await Promise.all(
        groups.map(async (group, index) => {
          const route =
            group.length > 1
              ? await getRoute(start, group)
              : await getIndividualRoute(start, group[0]);

          const weather = await Promise.all(group.map(getWeather));
          const allDeliveries = group.flatMap(dest => dest.deliveries);

          const distance =
            'totalDistanceKm' in route ? route.totalDistanceKm : route.distanceKm;

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

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
