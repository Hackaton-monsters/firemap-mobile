import type { ChatListItem } from "@/src/api/chat/types";
import type { Marker } from "@/src/api/reports/types";

type SerializedChatParams = {
  chatId: string;
  title: string;
  markerId: string;
  markerChatId: string;
  markerLat: string;
  markerLon: string;
  markerType: string;
  markerTitle: string;
  markerReportsCount: string;
  reportsLength: string;
  [key: string]: string;
};

/**
 * Serializes ChatListItem to router parameters
 */
export function serializeChatListItem(
  chat: ChatListItem
): SerializedChatParams {
  const params: SerializedChatParams = {
    chatId: chat.marker.chatId.toString(),
    title: chat.marker.title,
    markerId: chat.marker.id.toString(),
    markerChatId: chat.marker.chatId.toString(),
    markerLat: chat.marker.lat.toString(),
    markerLon: chat.marker.lon.toString(),
    markerType: chat.marker.type,
    markerTitle: chat.marker.title,
    markerReportsCount: chat.marker.reportsCount.toString(),
    reportsLength: chat.marker.reports.length.toString(),
  };

  // Serialize reports
  chat.marker.reports.forEach((report, index) => {
    params[`report_${index}_id`] = report.id.toString();
    params[`report_${index}_comment`] = report.comment || "";

    // Serialize photos
    if (report.photos && report.photos.length > 0) {
      params[`report_${index}_photosLength`] = report.photos.length.toString();
      report.photos.forEach((photoId, photoIndex) => {
        params[`report_${index}_photo_${photoIndex}`] = photoId.toString();
      });
    } else {
      params[`report_${index}_photosLength`] = "0";
    }
  });

  return params;
}

/**
 * Deserializes router parameters back to Marker
 */
export function deserializeMarkerFromParams(
  params: Record<string, string | string[]>
): Marker {
  const getValue = (key: string): string => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const reportsLength = parseInt(getValue("reportsLength") || "0", 10);
  const reports = [];

  // Deserialize reports
  for (let i = 0; i < reportsLength; i++) {
    const photosLength = parseInt(
      getValue(`report_${i}_photosLength`) || "0",
      10
    );
    const photos: number[] = [];

    // Deserialize photos
    for (let j = 0; j < photosLength; j++) {
      const photoId = getValue(`report_${i}_photo_${j}`);
      if (photoId) {
        photos.push(parseInt(photoId, 10));
      }
    }

    reports.push({
      id: parseInt(getValue(`report_${i}_id`), 10),
      comment: getValue(`report_${i}_comment`) || "",
      photos: photos.length > 0 ? photos : null,
    });
  }

  return {
    id: parseInt(getValue("markerId"), 10),
    chatId: parseInt(getValue("markerChatId"), 10),
    lat: parseFloat(getValue("markerLat")),
    lon: parseFloat(getValue("markerLon")),
    type: getValue("markerType") as "fire" | "rescue",
    title: getValue("markerTitle"),
    reportsCount: parseInt(getValue("markerReportsCount"), 10),
    isMember: true,
    reports,
  };
}
