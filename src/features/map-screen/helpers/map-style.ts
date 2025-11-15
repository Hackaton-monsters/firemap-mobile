
type MapStyleConfig = {
  mbtilesUrl: string;
};

export function createMapStyle({ mbtilesUrl }: MapStyleConfig) {
  return {
    version: 8,
    name: 'Cyprus offline',
    sources: {
      openmaptiles: {
        type: 'vector',
        url: mbtilesUrl,
      },
    },
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#f8f4f0',
        },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': '#aad3df',
          'fill-opacity': 0.8,
        },
      },
      {
        id: 'landuse',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        paint: {
          'fill-color': '#e8e8e8',
          'fill-opacity': 0.4,
        },
      },
      {
        id: 'park',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'park',
        paint: {
          'fill-color': '#c8e6c9',
          'fill-opacity': 0.6,
        },
      },
      {
        id: 'building',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        minzoom: 14,
        paint: {
          'fill-color': '#d9d0c9',
          'fill-opacity': 0.7,
        },
      },
      {
        id: 'road',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#ffffff',
          'line-width': [
            'interpolate',
            ['exponential', 1.5],
            ['zoom'],
            8,
            0.5,
            12,
            2,
            16,
            8,
            18,
            12,
          ],
        },
      },
      {
        id: 'road-casing',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#c0c0c0',
          'line-width': [
            'interpolate',
            ['exponential', 1.5],
            ['zoom'],
            8,
            0.8,
            12,
            3,
            16,
            10,
            18,
            14,
          ],
          'line-gap-width': [
            'interpolate',
            ['exponential', 1.5],
            ['zoom'],
            8,
            0.5,
            12,
            2,
            16,
            8,
            18,
            12,
          ],
        },
      },
      {
        id: 'place-label',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 14,
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#333333',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
        },
      },
    ],
  };
}
