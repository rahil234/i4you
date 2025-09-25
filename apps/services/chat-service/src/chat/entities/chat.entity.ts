export class Chat {
  constructor(
    public id: string,
    public participants: [string, string],
    public lastMessage: {
      sender: string;
      content: string;
      timestamp: string;
    } | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
