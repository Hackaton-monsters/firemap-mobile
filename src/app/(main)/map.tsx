import { useMarkersQuery } from '@/src/api/reports/hooks';
import { CyprusOfflineMap } from "@/src/features/map-screen/components/CyprusOfflineMap";
import { useMapScreen } from '@/src/features/map-screen/hooks/useMapScreen';
import { MarkerBottomSheet } from '@/src/features/marker-details/components/MarkerBottomSheet';
import { ReportFormBottomSheet } from '@/src/features/report-creation/components/ReportFormBottomSheet';
import { ReportSuccessNotice } from '@/src/features/report-creation/components/ReportSuccessNotice';
import { useMapNavigationStore } from '@/src/shared/stores/map-navigation.store';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';


export default function MapScreen() {
  const { data: markersData, refetch: refetchMarkers } = useMarkersQuery();
  const { pendingMarker, setPendingMarker } = useMapNavigationStore();

  const {
    cameraRef,
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
    handleNavigateToMarkerPress,
  } = useMapScreen(refetchMarkers);

  // Handle navigation from chat screen
  useEffect(() => {
    if (pendingMarker) {
      handleNavigateToMarkerPress(pendingMarker);
      setPendingMarker(null);
    }
  }, [pendingMarker, handleNavigateToMarkerPress, setPendingMarker]);

  // Get the updated marker from the markers query to reflect real-time changes
  const currentMarker = selectedMarker
    ? markersData?.markers.find((m) => m.id === selectedMarker.id) || selectedMarker
    : null;

  return (
    <View style={styles.container}>
      <CyprusOfflineMap
        cameraRef={cameraRef}
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
          onClose={handleCloseNotice}
          onOpenReport={handleOpenReport}
          marker={successResponse.marker}
        />
      )}
      <MarkerBottomSheet
        visible={!!selectedMarker}
        marker={currentMarker}
        isJoined={false}
        onClose={handleCloseMarkerSheet}
        onNavigateToMarkerPress={handleNavigateToMarkerPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});