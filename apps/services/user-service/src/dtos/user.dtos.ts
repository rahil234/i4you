import type { User } from '@repo/shared';

class UserDTO implements User {
  id: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  photos: string[];
  location: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;

  constructor(user: any) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.age = user.age;
    this.bio = user.bio;
    this.photos = user.photos;
    this.location = user.location;
    this.phone = user.phone;
    this.address = user.address;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

export default UserDTO;
