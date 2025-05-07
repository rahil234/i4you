class AdminDTO implements Omit<AdminDTO, 'location'> {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  joined: string;
  status: 'active' | 'suspended';

  constructor(user: any) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = 'admin';
    this.status = user.status;
    this.joined = user.createdAt;
  }
}

export default AdminDTO;
