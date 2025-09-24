export const MEDIA_MESSAGES = {
  UPLOAD_URL_SUCCESS: 'Upload URL generated successfully',
  IMAGES_FETCH_SUCCESS: 'Images fetched successfully',
  IMAGE_DELETE_SUCCESS: 'Image deleted successfully',
} as const;

export const MODERATION_STATUS = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING: 'pending',
} as const;

export const MODERATION_MESSAGES = {
  FETCH_SUCCESS: 'Moderation images fetched successfully',
  UPDATE_SUCCESS: 'Moderation updated successfully',
  INVALID_STATUS: 'Invalid moderation status',
} as const;
