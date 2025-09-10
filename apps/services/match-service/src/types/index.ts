import { User } from '@i4you/shared';
import { Location, Preferences } from '@i4you/proto-files/user/v2';

export const TYPES = {
  MatchRepository: Symbol.for('MatchRepository'),
  InteractionService: Symbol.for('InteractionService'),
  MatchService: Symbol.for('MatchService'),
  MediaService: Symbol.for('MediaService'),
  CacheService: Symbol.for('CacheService'),
  MatchController: Symbol.for('MatchController'),
  DiscoveryGrpcService: Symbol.for('DiscoveryGrpcService'),
  UserGrpcService: Symbol.for('UserGrpcService'),
  KafkaService: Symbol.for('KafkaService'),
  UserGrpcProvider: Symbol.for('UserGrpcProvider'),
  DiscoveryGrpcProvider: Symbol.for('DiscoveryGrpcProvider'),
  InteractionGrpcProvider: Symbol.for('InteractionGrpcProvider'),
};

export interface Match {
  id: string;
  matchedUserId: string;
  createdAt: string;
  user: Omit<
    Partial<User>,
    | 'password'
    | 'email'
    | 'onboardingCompleted'
    | 'gender'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
  >;
}

export interface MatchEventPayload {
  recipientId: string;
  data: {
    userId: string;
    matchedUserId: string;
    name: string;
    photo: string;
    timestamp: Date;
  };
}

export interface GetMatchesRequest {
  preferences: Preferences;
  location: Location;
  excludeUserIds?: string[];
}
