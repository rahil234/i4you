import {handleUnaryCall, ServerUnaryCall, sendUnaryData} from "@grpc/grpc-js";
import {
    GreeterServiceService,
    GreeterServiceServer as GS,
    SayHelloRequest,
    SayHelloResponse
} from "generated/greeter/v2/greeter";

export class GreeterServer implements GS {
    [method: string]: handleUnaryCall<SayHelloRequest, SayHelloResponse>;

    sayHello(call: ServerUnaryCall<SayHelloRequest, SayHelloResponse>, callback: sendUnaryData<SayHelloResponse>): void {
        const request = call.request;
        const reply = SayHelloResponse.create();
        reply.message = `Hello, ${request.name}!`;
        callback(null, reply);
    }
}

export {GreeterServiceService}