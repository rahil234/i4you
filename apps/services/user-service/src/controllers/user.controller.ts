import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
    constructor(private userService: UserService) {}

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const token = await this.userService.login(email, password);
            res.json({ token });
        } catch (error) {
            res.status(401).json({ message: 'Login failed' });
        }
    }
}
