import type {User} from "@repo/shared"

class UserDTO implements User {
    id: string;
    name: string;
    email: string;
    age: number;
    bio: string;
    photos: string[];
    location: string;

    constructor(user: any) {
        this.id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.age = user.age;
        this.bio = user.bio;
        this.photos = user.photos;
        this.location = user.location;
    }
}

export default UserDTO;
