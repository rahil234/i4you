import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import {UserRequest, UserResponse} from './proto/user';2
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, './proto/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition) as any;

const client = new userProto.user.UserService(
    'user-service:50051',
    grpc.credentials.createInsecure()
);

type Error = {
    code: number;
    message: string;
};

export const getUserFromService = (id: string): Promise<UserResponse | Error> =>
    new Promise((resolve, reject) => {
        client.GetUser({id}, (error: any, response: UserResponse) => {
            if (error) return reject(error);
            return resolve(response);
        });
    });
