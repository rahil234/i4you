interface UserRepository {
    findByEmail(email: string): Promise<any>;
    create(user: any): Promise<any>;
}
export default UserRepository;