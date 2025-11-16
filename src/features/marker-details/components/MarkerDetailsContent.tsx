import type { Marker, Report } from '@/src/api/reports/types';
import { PhotoGallery } from '@/src/shared/components/PhotoGallery/PhotoGallery';
import { PhotoThumbnail } from '@/src/shared/components/PhotoThumbnail/PhotoThumbnail';
import { Colors } from '@/src/shared/constants/colors';
import { getCloudinaryFullSize } from '@/src/shared/helpers/cloudinary';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const ReportCard = ({ report, markerType }: { report: Report; markerType: 'fire' | 'rescue' }) => {
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const iconName = markerType === 'fire' ? 'local-fire-department' : 'health-and-safety';
  const iconColor = markerType === 'fire' ? Colors.danger : Colors.warning;

  const handlePhotoPress = (index: number) => {
    setSelectedPhotoIndex(index);
    setGalleryVisible(true);
  };

  // Optimize photos for fullscreen gallery viewing
  const fullSizePhotos = report.photos?.map(url => getCloudinaryFullSize(url, 1200)) || [];
  const previewSizePhotos = report.photos?.map(url => getCloudinaryFullSize(url, 200)) || [];

  return (
    <>
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

        {previewSizePhotos && previewSizePhotos.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photosContainer}
            contentContainerStyle={styles.photosContent}
          >
            {previewSizePhotos.map((photoUrl, index) => (
              <PhotoThumbnail
                key={photoUrl}
                photoUrl={photoUrl}
                onPress={() => handlePhotoPress(index)}
                size={100}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {previewSizePhotos && previewSizePhotos.length > 0 && (
        <PhotoGallery
          photos={fullSizePhotos}
          initialIndex={selectedPhotoIndex}
          visible={galleryVisible}
          onClose={() => setGalleryVisible(false)}
        />
      )}
    </>
  );
};

type IProps = {
  marker: Marker;
};

export const MarkerDetailsContent = ({ marker }: IProps) => {
  return (
    <>
      {marker.reports.map((report) => (
        <ReportCard key={report.id} report={report} markerType={marker.type} />
      ))}
    </>

  );
};

const styles = StyleSheet.create({
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
  photosContainer: {
    marginTop: 12,
    marginHorizontal: -12,
  },
  photosContent: {
    paddingHorizontal: 12,
    gap: 8,
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
