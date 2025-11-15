import { useMarkersQuery } from '@/src/api/reports/hooks';
import type { Marker, MarkerResponse } from '@/src/api/reports/types';
import { CyprusOfflineMap, SelectedPoint } from "@/src/features/map-screen/components/CyprusOfflineMap";
import { MarkerBottomSheet } from '@/src/features/marker-details/components/MarkerBottomSheet';
import { ReportFormBottomSheet } from '@/src/features/report-creation/components/ReportFormBottomSheet';
import { ReportSuccessNotice } from '@/src/features/report-creation/components/ReportSuccessNotice';
import { useBottomTabBarHeight } from '@/src/shared/hooks/useBottomTabBarHeight';
import { useAuthStore } from '@/src/shared/stores/auth.store';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function MapScreen() {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [successResponse, setSuccessResponse] = useState<MarkerResponse | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  
  const tabBarHeight = useBottomTabBarHeight();
  const { data: markersData, refetch: refetchMarkers } = useMarkersQuery();
  const currentUser = useAuthStore((state) => state.user);

  const handleAddPress = () => {
    if (!selectedPoint) return;
    setShowReportForm(true);
  };

  const handleCloseForm = () => {
    setShowReportForm(false);
    setSelectedPoint(null);
  };

  const handleReportSuccess = (response: MarkerResponse) => {
    setSuccessResponse(response);
    setShowReportForm(false);
    setSelectedPoint(null);
    refetchMarkers();
  };

  const handleCloseNotice = () => {
    setSuccessResponse(null);
  };

  const handleOpenReport = () => {
    if (!successResponse) return;
    setSelectedMarker(successResponse.marker);
    setSuccessResponse(null);
  };

  const handleMarkerPress = (marker: Marker) => {
    setSelectedMarker(marker);
    setSelectedPoint(null);
  };

  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight }]}>
      <CyprusOfflineMap
        selectedPoint={selectedPoint}
        onPointSelect={setSelectedPoint}
        onAddPress={handleAddPress}
        markers={markersData?.markers || []}
        onMarkerPress={handleMarkerPress}
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
        marker={selectedMarker}
        currentUserId={currentUser?.id}
        isJoined={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});