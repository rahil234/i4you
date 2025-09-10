export class Admin {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public status: 'active' | 'suspended' = 'active',
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
