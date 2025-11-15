import type { Marker } from '@/src/api/reports/types';
import { Colors } from '@/src/shared/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

type IProps = {
  marker: Marker;
};

export const MarkerHeader = ({ marker }: IProps) => {
  const iconName = marker.type === 'fire' ? 'local-fire-department' : 'health-and-safety';
  const iconColor = marker.type === 'fire' ? Colors.danger : Colors.warning;
  const typeLabel = marker.type === 'fire' ? 'Fire' : 'Rescue';

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.iconWrapper, { backgroundColor: iconColor }]}>
          <MaterialIcons name={iconName} size={24} color="white" />
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{marker.title}</Text>
          <View style={styles.meta}>
            <Text style={styles.type}>{typeLabel}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.reports}>
              {marker.reportsCount} {marker.reportsCount === 1 ? 'report' : 'reports'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  type: {
    fontSize: 13,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  separator: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  reports: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
