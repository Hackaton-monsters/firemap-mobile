export type Report = {
  id: number;
  comment: string;
  photos: number[] | null;
};

export type Marker = {
  id: number;
  lat: number;
  lon: number;
  reports: Report[];
  reportsCount: number;
  type: "fire" | "rescue";
  title: string;
  chatId: number;
  isMember: boolean;
};

export type MarkerPayload = {
  lat: number;
  lon: number;
  type: "fire" | "rescue";
  comment?: string;
  photos?: string[]; // Array of images IDs
};

export type MarkerResponse = {
  isNew: boolean;
  marker: Marker;
};

export type MarkersResponse = {
  markers: Marker[];
};

export type PhotoUploadResponse = {
  id: string;
  url: string;
};
