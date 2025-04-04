// @generated by protobuf-ts 2.9.4
// @generated from protobuf file "user-files" (package "user", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { UserService } from "./user";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { UserResponse } from "./user";
import type { UserRequest } from "./user";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service user.AuthService
 */
export interface IUserServiceClient {
    /**
     * @generated from protobuf rpc: GetUser(user.UserRequest) returns (user.UserResponse);
     */
    getUser(input: UserRequest, options?: RpcOptions): UnaryCall<UserRequest, UserResponse>;
}
/**
 * @generated from protobuf service user.AuthService
 */
export class UserServiceClient implements IUserServiceClient, ServiceInfo {
    typeName = UserService.typeName;
    methods = UserService.methods;
    options = UserService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: GetUser(user.UserRequest) returns (user.UserResponse);
     */
    getUser(input: UserRequest, options?: RpcOptions): UnaryCall<UserRequest, UserResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<UserRequest, UserResponse>("unary", this._transport, method, opt, input);
    }
}
