import { Coordinate, Destination } from '@/types';

export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const R = 6371;
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const clusterDestinations = (destinations: Destination[], threshold = 50): Destination[][] => {
  const groups: Destination[][] = [];
  destinations.forEach(dest => {
    let added = false;
    for (const group of groups) {
      if (group.some(existing => calculateDistance(dest, existing) <= threshold)) {
        group.push(dest);
        added = true;
        break;
      }
    }
    if (!added) groups.push([dest]);
  });
  return groups;
};
