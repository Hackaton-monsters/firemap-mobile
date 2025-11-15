import { useMarkersQuery } from '@/src/api/reports/hooks';
import { CyprusOfflineMap } from "@/src/features/map-screen/components/CyprusOfflineMap";
import { useMapScreen } from '@/src/features/map-screen/hooks/useMapScreen';
import { MarkerBottomSheet } from '@/src/features/marker-details/components/MarkerBottomSheet';
import { ReportFormBottomSheet } from '@/src/features/report-creation/components/ReportFormBottomSheet';
import { ReportSuccessNotice } from '@/src/features/report-creation/components/ReportSuccessNotice';
import { useBottomTabBarHeight } from '@/src/shared/hooks/useBottomTabBarHeight';
import { StyleSheet, View } from 'react-native';

export default function MapScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { data: markersData, refetch: refetchMarkers } = useMarkersQuery();

  const {
    selectedPoint,
    showReportForm,
    successResponse,
    selectedMarker,
    setSelectedPoint,
    handleAddPress,
    handleCloseForm,
    handleReportSuccess,
    handleCloseNotice,
    handleOpenReport,
    handleMarkerPress,
    handleCloseMarkerSheet,
  } = useMapScreen(refetchMarkers);

  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight }]}>
      <CyprusOfflineMap
        selectedPoint={selectedPoint}
        onPointSelect={setSelectedPoint}
        onAddPress={handleAddPress}
        markers={markersData?.markers}
        onMarkerPress={handleMarkerPress}
        selectedMarkerId={selectedMarker?.id}
      />
      <ReportFormBottomSheet
        visible={showReportForm && !!selectedPoint}
        latitude={selectedPoint?.latitude ?? 0}
        longitude={selectedPoint?.longitude ?? 0}
        onClose={handleCloseForm}
        onSuccess={handleReportSuccess}
      />
      {successResponse && (
        <ReportSuccessNotice
          isNew={successResponse.isNew}
          marker={successResponse.marker}
          onClose={handleCloseNotice}
          onOpenReport={handleOpenReport}
        />
      )}
      <MarkerBottomSheet
        visible={!!selectedMarker}
        marker={selectedMarker}
        isJoined={false}
        onClose={handleCloseMarkerSheet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});