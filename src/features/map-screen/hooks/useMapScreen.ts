import type { Marker, MarkerResponse } from '@/src/api/reports/types';
import type { SelectedPoint } from '@/src/features/map-screen/components/CyprusOfflineMap';
import { useState } from 'react';

export const useMapScreen = (refetchMarkers: () => void) => {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [successResponse, setSuccessResponse] = useState<MarkerResponse | null>(null);
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

  const handleOpenReport = () => {
    if (!successResponse) return;
    setSelectedMarker(successResponse.marker);
    setSuccessResponse(null);
  };

  const handleMarkerPress = (marker: Marker) => {
    setSelectedMarker(marker);
    setSelectedPoint(null);
  };

  const handleCloseMarkerSheet = () => {
    setSelectedMarker(null);
  };

  return {
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
  };
};
