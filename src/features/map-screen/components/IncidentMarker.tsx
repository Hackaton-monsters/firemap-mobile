import type { Marker } from '@/src/api/reports/types';
import { Colors } from '@/src/shared/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PointAnnotation } from '@maplibre/maplibre-react-native';
import { StyleSheet, View } from 'react-native';

type IProps = {
  marker: Marker;
  onPress: () => void;
};

export const IncidentMarker = ({ marker, onPress }: IProps) => {
  const iconName = marker.type === 'fire' ? 'local-fire-department' : 'health-and-safety';
  const iconColor = marker.type === 'fire' ? Colors.danger : Colors.warning;

  return (
    <PointAnnotation
      id={`marker-${marker.id}`}
      coordinate={[marker.lon, marker.lat]}
      onSelected={onPress}
    >
      <View style={styles.container}>
        <View style={[styles.iconWrapper, { backgroundColor: iconColor }]}>
          <MaterialIcons name={iconName} size={24} color="white" />
        </View>
        {marker.reportsCount > 1 && (
          <View style={styles.badge}>
            <View style={styles.badgeInner}>
              <MaterialIcons name="error" size={12} color={Colors.danger} />
            </View>
          </View>
        )}
      </View>
    </PointAnnotation>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  badgeInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
