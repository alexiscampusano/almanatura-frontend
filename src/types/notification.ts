export type NotificationChannel = "EMAIL";

export type OutboundNotificationStatus = "PENDING" | "SENT" | "FAILED";

export type OutboundNotificationResponse = {
  id: number;
  channel: NotificationChannel;
  recipientHint: string;
  subject: string | null;
  body: string | null;
  status: OutboundNotificationStatus;
};

export type CreateOutboundNotificationPayload = {
  channel: NotificationChannel;
  recipientHint: string;
  subject?: string;
  body?: string;
};
