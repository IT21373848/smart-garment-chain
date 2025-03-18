import React from 'react';
import { View, Text, Image, ScrollView, Linking } from 'react-native';

type Delivery = {
  volume_cft: number;
  weight_kg: number;
};

type Destination = {
  lat: number;
  lng: number;
  deliveries: Delivery[];
};

type Weather = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
};

type VehicleInfo = {
  strategy: string;
  total_distance_km: number;
  total_estimated_cost_LKR: number;
  total_volume_cft: number;
  total_weight_kg: number;
  vehicles: string[];
};

type Route = {
  totalDistanceKm: number;
  routeLink: string;
};

type GroupedRoute = {
  groupId: number;
  destinations: Destination[];
  route: Route;
  weather: Weather[];
  vehicles: VehicleInfo;
};

type Props = {
  transportData: {
    groupedRoutes: GroupedRoute[];
  };
};

const OptimizedTransport: React.FC<Props> = ({ transportData }) => {
  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#F3F4F6' }}>
      <Text style={{ marginBottom: 16, fontSize: 24, fontWeight: 'bold', color: '#2D3748' }}>
        Optimized Transport Plan
      </Text>
      {transportData?.groupedRoutes?.map((group) => (
        <View key={group.groupId} style={{ marginBottom: 24, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#3182CE' }}>Group {group.groupId}</Text>
          <Text style={{ fontSize: 16, color: '#4A5568' }}>Vehicle Strategy: {group.vehicles.strategy}</Text>
          <Text style={{ fontSize: 16, color: '#4A5568' }}>
            Total Distance: {group.route.totalDistanceKm.toFixed(2)} km
          </Text>
          <Text style={{ fontSize: 16, color: '#4A5568' }}>
            Estimated Cost: LKR {group.vehicles.total_estimated_cost_LKR.toLocaleString()}
          </Text>
          <Text
            onPress={() => Linking.openURL(group.route.routeLink)}
            style={{ color: '#3182CE', marginTop: 8 }}
          >
            View Route on Google Maps
          </Text>

          <Text style={{ marginTop: 16, fontWeight: '600', fontSize: 16 }}>Destinations:</Text>
          {group.destinations?.map((destination, index) => (
            <View key={index} style={{ paddingLeft: 16, marginTop: 8, borderLeftWidth: 4, borderLeftColor: '#3182CE' }}>
              <Text style={{ fontSize: 14, color: '#2D3748' }}>
                Latitude: {destination.lat}, Longitude: {destination.lng}
              </Text>
              <Text style={{ fontSize: 14, color: '#2D3748' }}>Deliveries:</Text>
              {destination.deliveries?.map((delivery, idx) => (
                <Text key={idx} style={{ fontSize: 14, color: '#4A5568', marginLeft: 16 }}>
                  {delivery.volume_cft} CFT, {delivery.weight_kg} KG
                </Text>
              ))}
            </View>
          ))}

          <Text style={{ marginTop: 16, fontWeight: '600', fontSize: 16 }}>Weather Conditions:</Text>
          {group.weather?.map((w, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${w.weather[0].icon}.png` }}
                style={{ width: 32, height: 32, marginRight: 8 }}
              />
              <Text style={{ fontSize: 14, color: '#4A5568' }}>
                {w.name}: {w.weather[0].description}, Temp: {w.main.temp}°C, Humidity: {w.main.humidity}%
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default OptimizedTransport;
