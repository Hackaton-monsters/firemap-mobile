import type { Marker, Report } from '@/src/api/reports/types';
import { Colors } from '@/src/shared/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

const ReportCard = ({ report, markerType }: { report: Report; markerType: 'fire' | 'rescue' }) => {
  const iconName = markerType === 'fire' ? 'local-fire-department' : 'health-and-safety';
  const iconColor = markerType === 'fire' ? Colors.danger : Colors.warning;

  return (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={[styles.reportIcon, { backgroundColor: iconColor }]}>
          <MaterialIcons name={iconName} size={20} color="white" />
        </View>
        <View style={styles.reportHeaderText}>
          <Text style={styles.reportType}>{markerType === 'fire' ? 'Fire' : 'Rescue'}</Text>
          <Text style={styles.reportDate}>Report #{report.id}</Text>
        </View>
      </View>

      {report.comment && (
        <Text style={styles.reportComment}>{report.comment}</Text>
      )}

      {report.photos && report.photos.length > 0 && (
        <View style={styles.photosInfo}>
          <Text style={styles.photosText}>{report.photos.length} photo(s) attached</Text>
        </View>
      )}
    </View>
  );
};

type IProps = {
  marker: Marker;
  style?: ViewStyle
};

export const MarkerDetailsContent = ({ marker, style }: IProps) => {
  return (
    <BottomSheetScrollView style={[styles.container, style]} showsVerticalScrollIndicator={false}>
      {marker.reports.map((report) => (
        <ReportCard key={report.id} report={report} markerType={marker.type} />
      ))}
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  reportCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reportIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportHeaderText: {
    flex: 1,
  },
  reportType: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    textTransform: 'capitalize',
  },
  reportDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  reportComment: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginTop: 4,
  },
  photosInfo: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  photosText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
