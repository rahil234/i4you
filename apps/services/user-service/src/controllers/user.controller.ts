import {NextFunction, Request, Response} from 'express';
import {UserService} from '@/services/user.service';
import {inject, injectable} from "inversify";
import {TYPES} from "@/types";

@injectable()
export class UserController {
    constructor(@inject(TYPES.UserService) private userService: UserService) {
    }

    getUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.header("X-User-Id");
            if (!userId) {
                res.status(401).json({message: 'Unauthorized'});
                return;
            }
            const user = await this.userService.getUserById(userId);

            res.status(200).json(user);
        } catch (e) {
            next(e);
        }
    }
}
