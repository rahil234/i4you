export const TYPES = {
  MediaController: Symbol.for('MediaController'),
  MediaService: Symbol.for('MediaService'),
  CacheService: Symbol.for('CacheService'),
};

interface SearchResponseImage {
  asset_id: string;
  public_id: string;
  asset_folder: string;
  filename: string;
  display_name: string;
  format: 'jpg' | 'png';
  version: number;
  resource_type: 'image';
  type: 'authenticated';
  created_at: Date;
  uploaded_at: Date;
  bytes: number;
  backup_bytes: number;
  width: number;
  height: number;
  aspect_ratio: number;
  pixels: number;
  url: string;
  secure_url: string;
  status: 'active' | 'pending';
  moderation_kind: 'manual' | 'auto';
  moderation_status: 'pending' | 'approved' | 'rejected';
  access_mode: 'public';
  access_control: null;
  etag: string;
  created_by: [object];
  uploaded_by: [object];
}

export interface SearchResponse {
  resources: SearchResponseImage[];
}

interface SignFields {
  timestamp: number;
  public_id: string;
  moderation: string;
  type: string;
  api_key: string;
  signature: string;
}

export interface UploadParams {
  url: string;
  fields: SignFields;
}
