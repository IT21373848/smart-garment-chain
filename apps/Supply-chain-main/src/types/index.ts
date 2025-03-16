// types/index.ts
export type Coordinate = {
    lat: number;
    lng: number;
  };
  
  export type Delivery = {
    volume_cft: number;
    weight_kg: number;
  };
  
  export type Destination = Coordinate & {
    deliveries: Delivery[];
  };
  