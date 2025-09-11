export const TYPES = {
  InteractionRepository: Symbol.for('InteractionRepository'),
  TokenRepository: Symbol.for('TokenRepository'),
  InteractionService: Symbol.for('InteractionService'),
  SubscriptionService: Symbol.for('SubscriptionService'),
  TokenService: Symbol.for('TokenService'),
  InteractionController: Symbol.for('InteractionController'),
  GrpcUserService: Symbol.for('GrpcUserService'),
  KafkaService: Symbol.for('KafkaService'),
};

export interface InteractionBalances {
  likes: number;
  superLikes: number;
  refill_time: Date | null;
}
