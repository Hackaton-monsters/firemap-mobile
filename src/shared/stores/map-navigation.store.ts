import { Marker } from '@/src/api/reports/types';
import { create } from 'zustand';

type MapNavigationState = {
  pendingMarker: Marker | null;
  setPendingMarker: (marker: Marker | null) => void;
};

export const useMapNavigationStore = create<MapNavigationState>((set) => ({
  pendingMarker: null,
  setPendingMarker: (marker) => set({ pendingMarker: marker }),
}));
