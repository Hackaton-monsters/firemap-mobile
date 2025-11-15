import {
  Camera,
  MapView,
  UserLocation,
  type CameraRef,
  type Location as MapLibreLocation,
  type MapViewRef
} from '@maplibre/maplibre-react-native';
import { useAssets } from 'expo-asset';
import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Linking,
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
import { CenterLocationButton } from './CenterLocationButton';
import { OutsideCyprusBanner } from './OutsideCyprusBanner';
import { PermissionBanner } from './PermissionBanner';

export function CyprusOfflineMap() {
  const { t } = useTranslation();
  const [assets, error] = useAssets([
    require('../../../../assets/tiles/cyprusmap.mbtiles'),
  ]);

  const [location, setLocation] = useState<MapLibreLocation | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    'granted' | 'denied' | 'undetermined'
  >('undetermined');
  const [isOutsideCyprus, setIsOutsideCyprus] = useState(false);
  const cameraRef = useRef<CameraRef>(null);
  const mapRef = useRef<MapViewRef>(null);

  const openSettings = () => {
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
      openSettings();
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

      if (!isInCyprus(longitude, latitude)) {
        const [constrainedLng, constrainedLat] = constrainToCyprus(longitude, latitude);

        cameraRef.current.flyTo({
          center: {
            longitude: constrainedLng,
            latitude: constrainedLat,
          },
          duration: 300,
        });
      } else {
        // The user is inside Cyprus; setCamera with actual center
        // cameraRef.current.setCamera({
        //   centerCoordinate: [lng, lat],
        //   animationDuration: 300,
        // });
      }
    } catch (err) {
      console.error('Failed to get map center', err);
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

  console.log(location)
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

        {permissionStatus === 'granted' && (
          <UserLocation visible onUpdate={handleLocationChanged} />
        )}
      </MapView>

      <CenterLocationButton onPress={handleCenterOnUserLocationPress} />

      {isOutsideCyprus && permissionStatus === 'granted' && (
        <OutsideCyprusBanner />
      )}

      {permissionStatus === 'denied' && (
        <PermissionBanner onOpenSettings={openSettings} />
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
