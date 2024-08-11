// Common types
type NotificationContext = {
  triggered_at: string;
  triggered_by: {
    source: string;
    id: string;
  };
};

type BaseNotification = {
  notification_type: "upload" | "delete";
  notification_context: NotificationContext;
  signature_key: string;
};

// Upload notification types
type AudioDetails = {
  codec: string;
  bit_rate: string;
  frequency: number;
  channels: number;
  channel_layout: string;
};

type VideoDetails = {
  pix_format: string;
  codec: string;
  level: number;
  profile: string;
  bit_rate: string;
  time_base: string;
};

export type UploadNotification = BaseNotification & {
  notification_type: "upload";
  timestamp: string;
  request_id: string;
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: "image" | "video";
  created_at: string;
  tags: string[];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  playback_url?: string;
  asset_folder: string;
  display_name: string;
  audio?: AudioDetails;
  video?: VideoDetails;
  is_audio: boolean;
  frame_rate?: number;
  bit_rate?: number;
  duration?: number;
  rotation: number;
  original_filename: string;
  nb_frames?: number;
  api_key: string;
};

// Delete notification types
type DeletedResource = {
  resource_type: "image" | "video" | "raw";
  type: string;
  asset_id: string;
  public_id: string;
  version: number;
  asset_folder: string;
  display_name: string;
};

export type DeleteNotification = BaseNotification & {
  notification_type: "delete";
  resources: DeletedResource[];
};
