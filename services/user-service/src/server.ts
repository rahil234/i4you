import express from "express";
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import {getUser} from './user.service';

const PROTO_PATH = path.resolve(__dirname, './proto/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition) as any;

const app = express();

const server = new grpc.Server();

server.addService(userProto.user.UserService.service, {
    GetUser: getUser
});

server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log('User Service running on port 50051');
    }
);

app.use((req, res, next) => {
    console.log(req.method, ":", req.url);
    res.json({name: 'Rahil Sardar'});
    // next();
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('Server started on port', PORT);
})
