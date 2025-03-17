import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import {UserResponse} from './proto/user';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const PROTO_PATH = path.resolve(__dirname, './proto/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition) as any;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'user-service:50051';

const client = new userProto.user.UserService(
    USER_SERVICE_URL,
    grpc.credentials.createInsecure()
);

type Error = {
    code: number;
    message: string;
};

export const getUserFromService = (id: string): Promise<UserResponse | Error> => {
    return new Promise((resolve, reject) => {
        client.GetUser({id}, (error: any, response: UserResponse) => {
            if (error) return reject(error);
            return resolve(response);
        });
    });
}