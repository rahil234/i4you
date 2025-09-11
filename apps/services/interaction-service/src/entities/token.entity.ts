export class Token {
  constructor(
    public userId: string,
    public likes: number,
    public superLikes: number,
    public nextRefill: Date
  ) {}
}
