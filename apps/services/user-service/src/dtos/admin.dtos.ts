class AdminDTO implements Omit<AdminDTO, 'location'> {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  location: string;
  joined: string;
  status: 'active' | 'suspended';

  constructor(user: any, role?: 'admin' | 'member') {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = role || user.role;
    this.status = user.status;
    this.joined = user.createdAt;

    this.location = user.location.displayName;
  }
}

export default AdminDTO;
