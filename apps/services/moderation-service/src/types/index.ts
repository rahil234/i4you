export const TYPES = {
  ModerationRepository: Symbol.for('ModerationRepository'),
  ModerationService: Symbol.for('ModerationService'),
  ModerationController: Symbol.for('ModerationController'),
};

export type ModerationStatus = 'approved' | 'pending' | 'rejected';

export interface ModerationImage {
  id: string;
  publicId: string;
  date: string;
  image: string;
  status: ModerationStatus;
}

export interface ModerationUpdateResult {
  publicId: string;
  moderationStatus: unknown;
}
