import { CyprusOfflineMap, SelectedPoint } from "@/src/features/map-screen/components/CyprusOfflineMap";
import { ReportFormModal } from '@/src/features/map-screen/components/ReportFormModal';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function MapScreen() {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  const handleAddPress = () => {
    if (!selectedPoint) return;
    setShowReportForm(true);
  };

  const handleCloseForm = () => {
    setShowReportForm(false);
    setSelectedPoint(null);
  };

  const handleSubmitReport = (data: any) => {
    console.log('Report submitted:', data);
    setShowReportForm(false);
    setSelectedPoint(null);
  };

  return (
    <View style={styles.container}>
      <CyprusOfflineMap
        selectedPoint={selectedPoint}
        onPointSelect={setSelectedPoint}
        onAddPress={handleAddPress}
      />
      {showReportForm && selectedPoint && (
        <ReportFormModal
          latitude={selectedPoint.latitude}
          longitude={selectedPoint.longitude}
          onClose={handleCloseForm}
          onSubmit={handleSubmitReport}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});