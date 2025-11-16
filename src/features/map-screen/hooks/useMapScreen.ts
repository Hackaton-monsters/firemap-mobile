import type { Marker, MarkerResponse } from "@/src/api/reports/types";
import type { SelectedPoint } from "@/src/features/map-screen/components/CyprusOfflineMap";
import { CameraRef } from "@maplibre/maplibre-react-native";
import { useCallback, useRef, useState } from "react";

export const useMapScreen = (refetchMarkers: () => void) => {
  const cameraRef = useRef<CameraRef>(null);

  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(
    null
  );
  const [showReportForm, setShowReportForm] = useState(false);
  const [successResponse, setSuccessResponse] = useState<MarkerResponse | null>(
    null
  );
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

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

  const handleOpenReport = (marker: Marker) => {
    setSelectedMarker(marker);
    setSuccessResponse(null);
  };

  const handleMarkerPress = (marker: Marker) => {
    setSelectedMarker(marker);
    setSelectedPoint(null);
  };

  const handleCloseMarkerSheet = () => {
    setSelectedMarker(null);
  };

  const handleNavigateToMarkerPress = useCallback((marker: Marker) => {
    setSelectedPoint(null);
    setSelectedMarker(null);

    // Use setTimeout to ensure the camera ref is ready
    setTimeout(() => {
      cameraRef.current?.flyTo({
        center: {
          longitude: marker.lon,
          latitude: marker.lat,
        },
        zoom: 16,
        duration: 1000,
      });
    }, 100);
  }, []);

  return {
    cameraRef,
    // State
    selectedPoint,
    showReportForm,
    successResponse,
    selectedMarker,

    // Setters
    setSelectedPoint,

    // Handlers
    handleAddPress,
    handleCloseForm,
    handleReportSuccess,
    handleCloseNotice,
    handleOpenReport,
    handleMarkerPress,
    handleCloseMarkerSheet,
    handleNavigateToMarkerPress,
  };
};
