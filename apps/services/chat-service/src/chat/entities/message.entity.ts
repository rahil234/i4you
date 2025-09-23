export class Message {
  constructor(
    public readonly id: string,
    public readonly chatId: string,
    public readonly sender: string,
    public readonly content: string,
    public readonly timestamp: number,
    public readonly status: 'sent' | 'delivered' | 'read',
    public readonly createdAt?: Date,
  ) {}
}
