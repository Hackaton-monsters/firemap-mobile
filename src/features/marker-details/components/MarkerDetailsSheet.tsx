import type { Marker, Report } from '@/src/api/reports/types';
import { Colors } from '@/src/shared/constants/colors';
import { StyledBottomSheet } from '@/src/shared/uikit/BottomSheet/StyledBottomSheet';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
  marker: Marker | null;
  visible: boolean;
  onClose: () => void;
};

export const MarkerDetailsSheet = ({ marker, visible, onClose }: IProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (visible && marker) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible, marker]);

  if (!marker) return null;

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose
      onClose={onClose}
    >
      <BottomSheetView style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{marker.title}</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </Pressable>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {marker.reportsCount} {marker.reportsCount === 1 ? 'report' : 'reports'}
            </Text>
          </View>
        </View>
      </BottomSheetView>

      <BottomSheetScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {marker.reports.map((report) => (
          <ReportCard key={report.id} report={report} markerType={marker.type} />
        ))}
      </BottomSheetScrollView>
    </StyledBottomSheet>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  metaRow: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
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
