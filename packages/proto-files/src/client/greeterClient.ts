import {GreeterServiceClient} from "generated/greeter/v2/greeter";
import {credentials} from "@grpc/grpc-js";

export const createGreeterClient = (url: string) => {
    return new GreeterServiceClient(url, credentials.createInsecure());
}