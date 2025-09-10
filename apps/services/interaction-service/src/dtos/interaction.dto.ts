export interface CreateInteractionDTO {
  fromUserId: string;
  toUserId: string;
  type: 'LIKE' | 'DISLIKE' | 'SUPERLIKE';
}
