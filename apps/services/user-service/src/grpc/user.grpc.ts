import {sendUnaryData, ServerUnaryCall} from "@grpc/grpc-js";
import {UserService} from "@/services/user.service";
import {UserRequest, UserResponse} from "@/proto/user";

export class GrpcUserService {
    constructor(private userService: UserService) {
    }

    getUser = async (
        call: ServerUnaryCall<UserRequest, UserResponse>,
        callback: sendUnaryData<UserResponse>
    ) => {
        try {
            console.log(`Fetching user with ID: ${call.request.id}`);
            const user = await this.userService.getUserById(call.request.id);

            if (!user) {
                callback({
                    code: 13,
                    message: "User not found",
                } as any, null);
                return;
            }

            const response: UserResponse = {
                id: user._id.toString(),
                name: user.name,
            };
            callback(null, response);
        } catch (error: any) {
            callback({
                code: 13,
                message: error.message,
            } as any, null);
        }
    };
}
