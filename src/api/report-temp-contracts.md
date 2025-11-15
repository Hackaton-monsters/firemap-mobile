# Report temp contracts


```ts
type Marker = {
  id: number;
  lat: number;
  lon: number;
  reports: Report[];
  reportsCount: number;
  type: string;
  title: string;
  chatId: number;
};

type MarkerPayload = {
  lat: number;
  lon: number;
  type: string;
  comment?: string;
  photos?: string[];
};

type MarkerResponse = {
  isNew: bool;
  marker: Marker;
};

type MarkersResponse = {
  markers: Marker[];
};

```