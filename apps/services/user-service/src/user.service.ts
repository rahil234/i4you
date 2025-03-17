import {UserRequest, UserResponse} from './proto/user';
import {ServerUnaryCall, sendUnaryData} from '@grpc/grpc-js';

export const getUser = (
    call: ServerUnaryCall<UserRequest, UserResponse>,
    callback: sendUnaryData<UserResponse>
) => {
    console.log(`Fetching user with ID: ${call.request.id}`);
    const response: UserResponse = {
        id: call.request.id,
        name: 'Rahil Sardar',
    };
    callback(null, response);
};