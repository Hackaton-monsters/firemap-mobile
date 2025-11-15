import { Marker } from '@/src/api/reports/types';
import { feature, featureCollection } from '@/src/shared/helpers/turf-feature';
import { PressEventWithFeatures, ShapeSource, SymbolLayer, SymbolLayerStyle } from '@maplibre/maplibre-react-native';
import { NativeSyntheticEvent } from 'react-native';
import { MARKERS_TYPES } from '../constants/markers';

type IProps = {
  markers: Marker[];
  onPress?: (markers: Marker[]) => void;
};

export const IncidentsMarkers = ({ markers, onPress }: IProps) => {
  const shape = featureCollection(markers.map((marker) => feature({
    type: 'Point',
    coordinates: [marker.lon, marker.lat],

  }, marker)))

  const handlePress = (e: NativeSyntheticEvent<PressEventWithFeatures>) => onPress?.(e.nativeEvent.features.map(f => f.properties as Marker))

  return (
    <ShapeSource
      cluster={false}
      id="markers"
      onPress={handlePress}
      shape={shape}>

      <SymbolLayer
        id="fire"
        style={{
          ...MarkersStyles,
          iconImage: MARKERS_TYPES.fire,
        }}
        filter={['==', ['literal', MARKERS_TYPES.fire], ['get', 'type']]}
      />
      <SymbolLayer
        id="rescue"

        style={{
          ...MarkersStyles,
          iconImage: MARKERS_TYPES.rescue,
        }}
        filter={['==', ['literal', MARKERS_TYPES.rescue], ['get', 'type']]}
      />
    </ShapeSource>
  );
};

const MarkersStyles: SymbolLayerStyle = {
  iconAllowOverlap: true,
  iconIgnorePlacement: true,

  iconPitchAlignment: 'map',
  iconRotationAlignment: 'viewport',
  iconSize: 0.2,
}

