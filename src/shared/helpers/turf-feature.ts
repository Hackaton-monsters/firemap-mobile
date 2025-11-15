import {
  BBox,
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  GeometryObject,
} from "geojson";

export function feature<
  G extends GeometryObject = Geometry,
  P extends GeoJsonProperties = GeoJsonProperties
>(
  geom: G | null,
  properties?: P,
  options: { bbox?: BBox; id?: any } = {}
): Feature<G, P> {
  const feat: any = { type: "Feature" };
  if (options.id === 0 || options.id) {
    feat.id = options.id;
  }
  if (options.bbox) {
    feat.bbox = options.bbox;
  }

  feat.properties = properties || {};
  feat.geometry = geom;
  return feat;
}

export function featureCollection<
  G extends GeometryObject = Geometry,
  P extends GeoJsonProperties = GeoJsonProperties
>(
  features: Array<Feature<G, P>>,
  options: { bbox?: BBox; id?: any } = {}
): FeatureCollection<G, P> {
  const fc: any = { type: "FeatureCollection" };
  if (options.id) {
    fc.id = options.id;
  }
  if (options.bbox) {
    fc.bbox = options.bbox;
  }
  fc.features = features;
  return fc;
}
