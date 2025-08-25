export const TYPES = {
  UserRepository: Symbol.for('UserRepository'),
  AdminRepository: Symbol.for('AdminRepository'),
  UserService: Symbol.for('UserService'),
  MediaService: Symbol.for('MediaService'),
  CacheService: Symbol.for('CacheService'),
  UserController: Symbol.for('UserController'),
  GrpcUserService: Symbol.for('GrpcUserService'),
  KafkaService: Symbol.for('KafkaService'),
};

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

export interface GetUsersRequestDTO {
  page: number;
  limit: number;
  search: string;
  status: string;
  gender: string;
}
