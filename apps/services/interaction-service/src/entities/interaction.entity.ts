export class Interaction {
  constructor(
    public readonly id: string,
    public readonly fromUserId: string,
    public readonly toUserId: string,
    public readonly type: 'LIKE' | 'DISLIKE' | 'SUPERLIKE',
    public readonly createdAt: Date
  ) {}
}
