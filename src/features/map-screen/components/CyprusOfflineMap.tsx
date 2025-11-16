import type { Marker } from '@/src/api/reports/types';
import {
  Camera,
  Images,
  MapView,
  PressEvent,
  UserLocation,
  type CameraRef,
  type Location as MapLibreLocation,
  type MapViewRef
} from '@maplibre/maplibre-react-native';
import { useAssets } from 'expo-asset';
import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Linking,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CYPRUS_BOUNDS,
  CYPRUS_CENTER,
  constrainToCyprus,
  isInCyprus
} from '../helpers/map-bounds';
import { createMapStyle } from '../helpers/map-style';
import { AddMarkerButton } from './AddMarkerButton';
import { CenterLocationButton } from './CenterLocationButton';
import { IncidentsMarkers } from './IncidentsMarkers';
import { OutsideCyprusBanner } from './OutsideCyprusBanner';
import { PermissionBanner } from './PermissionBanner';
import { TemporaryMarker } from './TemporaryMarker';

// @ts-ignore
import fireMarker from '@/assets/images/fire-marker.png';
// @ts-ignore
import rescueMarker from '@/assets/images/rescue-marker.png';
import { MARKERS_TYPES } from '../constants/markers';

export type SelectedPoint = {
  longitude: number;
  latitude: number;
};

type IProps = {
  cameraRef: RefObject<CameraRef | null>;
  selectedPoint: SelectedPoint | null;
  markers: Marker[] | undefined;
  selectedMarkerId: Marker['id'] | undefined;
  onPointSelect: (point: SelectedPoint | null) => void;
  onAddPress: () => void;
  onMarkerPress: (marker: Marker) => void;
};

const MIN_ZOOM_FOR_MARKER = 11;

export function CyprusOfflineMap({
  cameraRef,
  selectedPoint,
  onPointSelect,
  onAddPress,
  markers = [],
  onMarkerPress,
}: IProps) {
  const { t } = useTranslation();
  const [assets, error] = useAssets([
    require('../../../../assets/tiles/cyprusmap.mbtiles'),
  ]);

  const [location, setLocation] = useState<MapLibreLocation | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    'granted' | 'denied' | 'undetermined'
  >('undetermined');
  const [isOutsideCyprus, setIsOutsideCyprus] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number>(8);
  const mapRef = useRef<MapViewRef>(null);

  const handleOpenSettingsPress = () => {
    Alert.alert(t('map.permissions.title'), t('map.permissions.message'), [
      { text: t('map.permissions.cancel'), style: 'cancel' },
      {
        text: t('map.permissions.openSettings'),
        onPress: () => {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            Linking.openSettings();
          }
        },
      },
    ]);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissionStatus('denied');
        setIsOutsideCyprus(false);
        return;
      }

      setPermissionStatus('granted');
    })();
  }, []);

  const handleLocationChanged = (updatedLocaiton: MapLibreLocation) => {
    setLocation(updatedLocaiton);

    const { longitude, latitude } = updatedLocaiton.coords;
    setIsOutsideCyprus(!isInCyprus(longitude, latitude));
  }

  const handleCenterOnUserLocationPress = () => {
    if (permissionStatus === 'denied') {
      handleOpenSettingsPress();
      return;
    }

    if (location && cameraRef.current) {
      const { longitude, latitude } = location.coords;

      if (!isInCyprus(longitude, latitude)) {
        Alert.alert(
          t('map.locationNotice.title'),
          t('map.locationNotice.message'),
          [{ text: 'OK' }]
        );
        return;
      }

      cameraRef.current.flyTo({
        center: {
          longitude,
          latitude,
        },
        zoom: 15,
        duration: 1000,
      });
    }
  };

  const handleRegionDidChange = async () => {
    if (!mapRef.current) return;
    if (!cameraRef.current) return;

    try {
      const { latitude, longitude } = await mapRef.current.getCenter();
      const zoom = await mapRef.current.getZoom();
      setCurrentZoom(zoom);

      if (isInCyprus(longitude, latitude)) {
        return
      }

      const [constrainedLng, constrainedLat] = constrainToCyprus(longitude, latitude);

      cameraRef.current.flyTo({
        center: {
          longitude: constrainedLng,
          latitude: constrainedLat,
        },
        duration: 300,
      });
    } catch (err) {
      // console.error('Failed to get map center', err);
    }
  };

  const handleMapPress = async (event: NativeSyntheticEvent<PressEvent>) => {
    console.log('Map pressed', event.nativeEvent);
    const { latitude, longitude } = event.nativeEvent;

    if (!isInCyprus(longitude, latitude)) {
      Alert.alert(
        t('map.outOfBounds.title'),
        t('map.outOfBounds.message'),
        [{ text: 'OK' }]
      );
      return;
    }

    if (currentZoom < MIN_ZOOM_FOR_MARKER) {
      if (cameraRef.current) {
        cameraRef.current.flyTo({
          center: { longitude, latitude },
          zoom: MIN_ZOOM_FOR_MARKER + 1,
          duration: 800,
        });
      }
      return;
    }

    onPointSelect({ longitude, latitude });
  };

  const handleMarkerCancel = () => {
    onPointSelect(null);
  };

  const handleMarkerPress = (pressedMarkers: Marker[]) => {
    const shouldZoomIn = pressedMarkers.length > 1;

    if (shouldZoomIn) {
      if (!cameraRef.current) return
      const { lon, lat } = pressedMarkers[0];

      const isZoomMoreOrEqualThanMin = currentZoom >= MIN_ZOOM_FOR_MARKER;
      const targetZoom = isZoomMoreOrEqualThanMin ? currentZoom + 1 : MIN_ZOOM_FOR_MARKER;

      cameraRef.current.flyTo({
        center: { longitude: lon, latitude: lat },
        zoom: targetZoom,
        duration: 800,
      });
      return;
    } else {
      onMarkerPress(pressedMarkers[0]);
    }
  };

  const mapStyle = useMemo(() => {
    const localUri = assets?.[0]?.localUri;
    if (!localUri) return null;

    const mbtilesUrl = localUri.replace('file://', 'mbtiles://');
    return createMapStyle({ mbtilesUrl });
  }, [assets]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>
          {t('map.loadError')}: {String(error)}
        </Text>
      </View>
    );
  }

  if (!mapStyle) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>{t('map.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        mapStyle={mapStyle}
        logo={false}
        compass={true}
        attribution={false}
        onRegionDidChange={handleRegionDidChange}
        onPress={handleMapPress}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            longitude: location ? location.coords.longitude : CYPRUS_CENTER.longitude,
            latitude: location ? location.coords.latitude : CYPRUS_CENTER.latitude,
            zoom: location ? 13 : 8,
          }}
          maxBounds={CYPRUS_BOUNDS}
          minZoom={7}
          maxZoom={18}
        />
        <Images
          images={{
            [MARKERS_TYPES.fire]: fireMarker,
            [MARKERS_TYPES.rescue]: rescueMarker,
          }}
        />


        {permissionStatus === 'granted' && (
          <UserLocation visible onUpdate={handleLocationChanged} />
        )}


        <IncidentsMarkers
          markers={markers}
          onPress={handleMarkerPress}
        />

        {selectedPoint && (
          <TemporaryMarker
            longitude={selectedPoint.longitude}
            latitude={selectedPoint.latitude}
            onPress={handleMarkerCancel}
          />
        )}
      </MapView>

      <AddMarkerButton
        onAddPress={onAddPress}
        onCancelPress={handleMarkerCancel}
        visible={!!selectedPoint}
      />

      <CenterLocationButton
        onPress={handleCenterOnUserLocationPress}
        bottomOffset={selectedPoint ? 80 : 0}
      />

      {isOutsideCyprus && permissionStatus === 'granted' && (
        <OutsideCyprusBanner />
      )}

      {permissionStatus === 'denied' && (
        <PermissionBanner onOpenSettings={handleOpenSettingsPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
});
