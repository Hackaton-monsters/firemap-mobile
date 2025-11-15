export type Report = {
  id: number;
  lat: number;
  lon: number;
  type: string;
  comment?: string;
  photos?: string[];
  createdAt: string;
  userId: number;
};

export type Marker = {
  id: number;
  lat: number;
  lon: number;
  reports: Report[];
  reportsCount: number;
  type: string;
  title: string;
  chatId: number;
};

export type MarkerPayload = {
  lat: number;
  lon: number;
  type: string;
  comment?: string;
  photos?: string[];
};

export type MarkerResponse = {
  isNew: boolean;
  marker: Marker;
};

export type MarkersResponse = {
  markers: Marker[];
};
