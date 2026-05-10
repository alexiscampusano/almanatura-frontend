import type {
  CreateOutboundNotificationPayload,
  OutboundNotificationResponse,
} from "@/types/notification";

import { apiClient } from "./api.client";

export async function createOutboundNotification(
  data: CreateOutboundNotificationPayload,
): Promise<OutboundNotificationResponse> {
  const response = await apiClient.post<OutboundNotificationResponse>(
    "/admin/notifications",
    data,
  );
  return response.data;
}
