import { Marker } from '@/src/api/reports/types';
import { Colors } from '@/src/shared/constants/colors';
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
      
      {/* Counter text for fire markers with multiple reports */}
      <SymbolLayer
        id="fire-counter"
        style={CounterTextStyles}
        filter={[
          'all',
          ['==', ['literal', MARKERS_TYPES.fire], ['get', 'type']],
          ['>', ['get', 'reportsCount'], 1]
        ]}
      />
      
      {/* Counter text for rescue markers with multiple reports */}
      <SymbolLayer
        id="rescue-counter"
        style={CounterTextStyles}
        filter={[
          'all',
          ['==', ['literal', MARKERS_TYPES.rescue], ['get', 'type']],
          ['>', ['get', 'reportsCount'], 1]
        ]}
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
};

const CounterTextStyles: SymbolLayerStyle = {
  textField: ['to-string', ['get', 'reportsCount']],
  textSize: 12,
  textColor: Colors.primary,
  textHaloColor: '#fff',
  textHaloWidth: 8,
  textHaloBlur: 0,
  textOffset: [0, 2.3],
  textAllowOverlap: true,
  textIgnorePlacement: true,
  textPitchAlignment: 'map',
  textRotationAlignment: 'viewport',
};

