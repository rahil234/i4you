// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               unknown
// source: greeter/v2/greeter.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import {
  type CallOptions,
  ChannelCredentials,
  Client,
  type ClientOptions,
  type ClientUnaryCall,
  type handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  type ServiceError,
  type UntypedServiceImplementation,
} from "@grpc/grpc-js";

export const protobufPackage = "greeter.v2";

export interface SayHelloRequest {
  name: string;
}

export interface SayHelloResponse {
  message: string;
}

function createBaseSayHelloRequest(): SayHelloRequest {
  return { name: "" };
}

export const SayHelloRequest: MessageFns<SayHelloRequest> = {
  encode(message: SayHelloRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SayHelloRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSayHelloRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SayHelloRequest {
    return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
  },

  toJSON(message: SayHelloRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SayHelloRequest>, I>>(base?: I): SayHelloRequest {
    return SayHelloRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SayHelloRequest>, I>>(object: I): SayHelloRequest {
    const message = createBaseSayHelloRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseSayHelloResponse(): SayHelloResponse {
  return { message: "" };
}

export const SayHelloResponse: MessageFns<SayHelloResponse> = {
  encode(message: SayHelloResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.message !== "") {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SayHelloResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSayHelloResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.message = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SayHelloResponse {
    return { message: isSet(object.message) ? globalThis.String(object.message) : "" };
  },

  toJSON(message: SayHelloResponse): unknown {
    const obj: any = {};
    if (message.message !== "") {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SayHelloResponse>, I>>(base?: I): SayHelloResponse {
    return SayHelloResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SayHelloResponse>, I>>(object: I): SayHelloResponse {
    const message = createBaseSayHelloResponse();
    message.message = object.message ?? "";
    return message;
  },
};

export type GreeterServiceService = typeof GreeterServiceService;
export const GreeterServiceService = {
  sayHello: {
    path: "/greeter.v2.GreeterService/SayHello",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: SayHelloRequest) => Buffer.from(SayHelloRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SayHelloRequest.decode(value),
    responseSerialize: (value: SayHelloResponse) => Buffer.from(SayHelloResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => SayHelloResponse.decode(value),
  },
} as const;

export interface GreeterServiceServer extends UntypedServiceImplementation {
  sayHello: handleUnaryCall<SayHelloRequest, SayHelloResponse>;
}

export interface GreeterServiceClient extends Client {
  sayHello(
    request: SayHelloRequest,
    callback: (error: ServiceError | null, response: SayHelloResponse) => void,
  ): ClientUnaryCall;
  sayHello(
    request: SayHelloRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: SayHelloResponse) => void,
  ): ClientUnaryCall;
  sayHello(
    request: SayHelloRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: SayHelloResponse) => void,
  ): ClientUnaryCall;
}

export const GreeterServiceClient = makeGenericClientConstructor(
  GreeterServiceService,
  "greeter.v2.GreeterService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): GreeterServiceClient;
  service: typeof GreeterServiceService;
  serviceName: string;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
