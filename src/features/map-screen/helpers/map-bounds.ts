export const CYPRUS_BOUNDS: [
  west: number,
  south: number,
  east: number,
  north: number
] = [32.0, 34.4, 34.9, 35.9];

export function isInCyprus(lng: number, lat: number): boolean {
  return (
    lng >= CYPRUS_BOUNDS[0] &&
    lng <= CYPRUS_BOUNDS[2] &&
    lat >= CYPRUS_BOUNDS[1] &&
    lat <= CYPRUS_BOUNDS[3]
  );
}

export function constrainToCyprus(lng: number, lat: number): [number, number] {
  const constrainedLng = Math.max(
    CYPRUS_BOUNDS[0],
    Math.min(CYPRUS_BOUNDS[2], lng)
  );
  const constrainedLat = Math.max(
    CYPRUS_BOUNDS[1],
    Math.min(CYPRUS_BOUNDS[3], lat)
  );
  return [constrainedLng, constrainedLat];
}

export const CYPRUS_CENTER: {
  longitude: number;
  latitude: number;
} = { longitude: 33.4299, latitude: 35.1264 };
