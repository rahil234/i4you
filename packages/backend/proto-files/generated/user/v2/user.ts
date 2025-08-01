// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.1
//   protoc               unknown
// source: user/v2/user.proto

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

export const protobufPackage = "user.v2";

export enum UserStatus {
  active = 0,
  suspended = 1,
  UNRECOGNIZED = -1,
}

export function userStatusFromJSON(object: any): UserStatus {
  switch (object) {
    case 0:
    case "active":
      return UserStatus.active;
    case 1:
    case "suspended":
      return UserStatus.suspended;
    case -1:
    case "UNRECOGNIZED":
    default:
      return UserStatus.UNRECOGNIZED;
  }
}

export function userStatusToJSON(object: UserStatus): string {
  switch (object) {
    case UserStatus.active:
      return "active";
    case UserStatus.suspended:
      return "suspended";
    case UserStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetUserByIdRequest {
  id: string;
}

export interface GetUserByEmailRequest {
  email: string;
}

export interface GetUserByIdResponse {
  user?: User | undefined;
}

export interface GetUserByEmailResponse {
  user?: User | undefined;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  bio: string;
  photos: string[];
  interests: string[];
  preferences?: User_Preferences | undefined;
  location?: User_Location | undefined;
  onboardingCompleted: boolean;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User_Preferences {
  /** [min, max] */
  ageRange: number[];
  distance: number;
  showMe: string;
  lookingFor: string;
}

export interface User_Location {
  /** Always "Point" */
  type: string;
  /** [longitude, latitude] */
  coordinates: number[];
  displayName: string;
}

function createBaseGetUserByIdRequest(): GetUserByIdRequest {
  return { id: "" };
}

export const GetUserByIdRequest: MessageFns<GetUserByIdRequest> = {
  encode(message: GetUserByIdRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetUserByIdRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserByIdRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
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

  fromJSON(object: any): GetUserByIdRequest {
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: GetUserByIdRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserByIdRequest>, I>>(base?: I): GetUserByIdRequest {
    return GetUserByIdRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserByIdRequest>, I>>(object: I): GetUserByIdRequest {
    const message = createBaseGetUserByIdRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetUserByEmailRequest(): GetUserByEmailRequest {
  return { email: "" };
}

export const GetUserByEmailRequest: MessageFns<GetUserByEmailRequest> = {
  encode(message: GetUserByEmailRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.email !== "") {
      writer.uint32(10).string(message.email);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetUserByEmailRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserByEmailRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.email = reader.string();
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

  fromJSON(object: any): GetUserByEmailRequest {
    return { email: isSet(object.email) ? globalThis.String(object.email) : "" };
  },

  toJSON(message: GetUserByEmailRequest): unknown {
    const obj: any = {};
    if (message.email !== "") {
      obj.email = message.email;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserByEmailRequest>, I>>(base?: I): GetUserByEmailRequest {
    return GetUserByEmailRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserByEmailRequest>, I>>(object: I): GetUserByEmailRequest {
    const message = createBaseGetUserByEmailRequest();
    message.email = object.email ?? "";
    return message;
  },
};

function createBaseGetUserByIdResponse(): GetUserByIdResponse {
  return { user: undefined };
}

export const GetUserByIdResponse: MessageFns<GetUserByIdResponse> = {
  encode(message: GetUserByIdResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.user !== undefined) {
      User.encode(message.user, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetUserByIdResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserByIdResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.user = User.decode(reader, reader.uint32());
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

  fromJSON(object: any): GetUserByIdResponse {
    return { user: isSet(object.user) ? User.fromJSON(object.user) : undefined };
  },

  toJSON(message: GetUserByIdResponse): unknown {
    const obj: any = {};
    if (message.user !== undefined) {
      obj.user = User.toJSON(message.user);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserByIdResponse>, I>>(base?: I): GetUserByIdResponse {
    return GetUserByIdResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserByIdResponse>, I>>(object: I): GetUserByIdResponse {
    const message = createBaseGetUserByIdResponse();
    message.user = (object.user !== undefined && object.user !== null) ? User.fromPartial(object.user) : undefined;
    return message;
  },
};

function createBaseGetUserByEmailResponse(): GetUserByEmailResponse {
  return { user: undefined };
}

export const GetUserByEmailResponse: MessageFns<GetUserByEmailResponse> = {
  encode(message: GetUserByEmailResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.user !== undefined) {
      User.encode(message.user, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetUserByEmailResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserByEmailResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.user = User.decode(reader, reader.uint32());
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

  fromJSON(object: any): GetUserByEmailResponse {
    return { user: isSet(object.user) ? User.fromJSON(object.user) : undefined };
  },

  toJSON(message: GetUserByEmailResponse): unknown {
    const obj: any = {};
    if (message.user !== undefined) {
      obj.user = User.toJSON(message.user);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserByEmailResponse>, I>>(base?: I): GetUserByEmailResponse {
    return GetUserByEmailResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserByEmailResponse>, I>>(object: I): GetUserByEmailResponse {
    const message = createBaseGetUserByEmailResponse();
    message.user = (object.user !== undefined && object.user !== null) ? User.fromPartial(object.user) : undefined;
    return message;
  },
};

function createBaseUser(): User {
  return {
    id: "",
    name: "",
    email: "",
    password: "",
    age: 0,
    gender: "",
    bio: "",
    photos: [],
    interests: [],
    preferences: undefined,
    location: undefined,
    onboardingCompleted: false,
    status: 0,
    createdAt: "",
    updatedAt: "",
  };
}

export const User: MessageFns<User> = {
  encode(message: User, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.email !== "") {
      writer.uint32(26).string(message.email);
    }
    if (message.password !== "") {
      writer.uint32(34).string(message.password);
    }
    if (message.age !== 0) {
      writer.uint32(40).int32(message.age);
    }
    if (message.gender !== "") {
      writer.uint32(50).string(message.gender);
    }
    if (message.bio !== "") {
      writer.uint32(58).string(message.bio);
    }
    for (const v of message.photos) {
      writer.uint32(66).string(v!);
    }
    for (const v of message.interests) {
      writer.uint32(74).string(v!);
    }
    if (message.preferences !== undefined) {
      User_Preferences.encode(message.preferences, writer.uint32(82).fork()).join();
    }
    if (message.location !== undefined) {
      User_Location.encode(message.location, writer.uint32(90).fork()).join();
    }
    if (message.onboardingCompleted !== false) {
      writer.uint32(96).bool(message.onboardingCompleted);
    }
    if (message.status !== 0) {
      writer.uint32(104).int32(message.status);
    }
    if (message.createdAt !== "") {
      writer.uint32(114).string(message.createdAt);
    }
    if (message.updatedAt !== "") {
      writer.uint32(122).string(message.updatedAt);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): User {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUser();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.password = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.age = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.gender = reader.string();
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.bio = reader.string();
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }

          message.photos.push(reader.string());
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }

          message.interests.push(reader.string());
          continue;
        }
        case 10: {
          if (tag !== 82) {
            break;
          }

          message.preferences = User_Preferences.decode(reader, reader.uint32());
          continue;
        }
        case 11: {
          if (tag !== 90) {
            break;
          }

          message.location = User_Location.decode(reader, reader.uint32());
          continue;
        }
        case 12: {
          if (tag !== 96) {
            break;
          }

          message.onboardingCompleted = reader.bool();
          continue;
        }
        case 13: {
          if (tag !== 104) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        }
        case 14: {
          if (tag !== 114) {
            break;
          }

          message.createdAt = reader.string();
          continue;
        }
        case 15: {
          if (tag !== 122) {
            break;
          }

          message.updatedAt = reader.string();
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

  fromJSON(object: any): User {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      email: isSet(object.email) ? globalThis.String(object.email) : "",
      password: isSet(object.password) ? globalThis.String(object.password) : "",
      age: isSet(object.age) ? globalThis.Number(object.age) : 0,
      gender: isSet(object.gender) ? globalThis.String(object.gender) : "",
      bio: isSet(object.bio) ? globalThis.String(object.bio) : "",
      photos: globalThis.Array.isArray(object?.photos) ? object.photos.map((e: any) => globalThis.String(e)) : [],
      interests: globalThis.Array.isArray(object?.interests)
        ? object.interests.map((e: any) => globalThis.String(e))
        : [],
      preferences: isSet(object.preferences) ? User_Preferences.fromJSON(object.preferences) : undefined,
      location: isSet(object.location) ? User_Location.fromJSON(object.location) : undefined,
      onboardingCompleted: isSet(object.onboardingCompleted) ? globalThis.Boolean(object.onboardingCompleted) : false,
      status: isSet(object.status) ? userStatusFromJSON(object.status) : 0,
      createdAt: isSet(object.createdAt) ? globalThis.String(object.createdAt) : "",
      updatedAt: isSet(object.updatedAt) ? globalThis.String(object.updatedAt) : "",
    };
  },

  toJSON(message: User): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.email !== "") {
      obj.email = message.email;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    if (message.age !== 0) {
      obj.age = Math.round(message.age);
    }
    if (message.gender !== "") {
      obj.gender = message.gender;
    }
    if (message.bio !== "") {
      obj.bio = message.bio;
    }
    if (message.photos?.length) {
      obj.photos = message.photos;
    }
    if (message.interests?.length) {
      obj.interests = message.interests;
    }
    if (message.preferences !== undefined) {
      obj.preferences = User_Preferences.toJSON(message.preferences);
    }
    if (message.location !== undefined) {
      obj.location = User_Location.toJSON(message.location);
    }
    if (message.onboardingCompleted !== false) {
      obj.onboardingCompleted = message.onboardingCompleted;
    }
    if (message.status !== 0) {
      obj.status = userStatusToJSON(message.status);
    }
    if (message.createdAt !== "") {
      obj.createdAt = message.createdAt;
    }
    if (message.updatedAt !== "") {
      obj.updatedAt = message.updatedAt;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<User>, I>>(base?: I): User {
    return User.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<User>, I>>(object: I): User {
    const message = createBaseUser();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.email = object.email ?? "";
    message.password = object.password ?? "";
    message.age = object.age ?? 0;
    message.gender = object.gender ?? "";
    message.bio = object.bio ?? "";
    message.photos = object.photos?.map((e) => e) || [];
    message.interests = object.interests?.map((e) => e) || [];
    message.preferences = (object.preferences !== undefined && object.preferences !== null)
      ? User_Preferences.fromPartial(object.preferences)
      : undefined;
    message.location = (object.location !== undefined && object.location !== null)
      ? User_Location.fromPartial(object.location)
      : undefined;
    message.onboardingCompleted = object.onboardingCompleted ?? false;
    message.status = object.status ?? 0;
    message.createdAt = object.createdAt ?? "";
    message.updatedAt = object.updatedAt ?? "";
    return message;
  },
};

function createBaseUser_Preferences(): User_Preferences {
  return { ageRange: [], distance: 0, showMe: "", lookingFor: "" };
}

export const User_Preferences: MessageFns<User_Preferences> = {
  encode(message: User_Preferences, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.ageRange) {
      writer.int32(v);
    }
    writer.join();
    if (message.distance !== 0) {
      writer.uint32(16).int32(message.distance);
    }
    if (message.showMe !== "") {
      writer.uint32(26).string(message.showMe);
    }
    if (message.lookingFor !== "") {
      writer.uint32(34).string(message.lookingFor);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): User_Preferences {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUser_Preferences();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.ageRange.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.ageRange.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.distance = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.showMe = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.lookingFor = reader.string();
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

  fromJSON(object: any): User_Preferences {
    return {
      ageRange: globalThis.Array.isArray(object?.ageRange) ? object.ageRange.map((e: any) => globalThis.Number(e)) : [],
      distance: isSet(object.distance) ? globalThis.Number(object.distance) : 0,
      showMe: isSet(object.showMe) ? globalThis.String(object.showMe) : "",
      lookingFor: isSet(object.lookingFor) ? globalThis.String(object.lookingFor) : "",
    };
  },

  toJSON(message: User_Preferences): unknown {
    const obj: any = {};
    if (message.ageRange?.length) {
      obj.ageRange = message.ageRange.map((e) => Math.round(e));
    }
    if (message.distance !== 0) {
      obj.distance = Math.round(message.distance);
    }
    if (message.showMe !== "") {
      obj.showMe = message.showMe;
    }
    if (message.lookingFor !== "") {
      obj.lookingFor = message.lookingFor;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<User_Preferences>, I>>(base?: I): User_Preferences {
    return User_Preferences.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<User_Preferences>, I>>(object: I): User_Preferences {
    const message = createBaseUser_Preferences();
    message.ageRange = object.ageRange?.map((e) => e) || [];
    message.distance = object.distance ?? 0;
    message.showMe = object.showMe ?? "";
    message.lookingFor = object.lookingFor ?? "";
    return message;
  },
};

function createBaseUser_Location(): User_Location {
  return { type: "", coordinates: [], displayName: "" };
}

export const User_Location: MessageFns<User_Location> = {
  encode(message: User_Location, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    writer.uint32(18).fork();
    for (const v of message.coordinates) {
      writer.double(v);
    }
    writer.join();
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): User_Location {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUser_Location();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.type = reader.string();
          continue;
        }
        case 2: {
          if (tag === 17) {
            message.coordinates.push(reader.double());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.coordinates.push(reader.double());
            }

            continue;
          }

          break;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.displayName = reader.string();
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

  fromJSON(object: any): User_Location {
    return {
      type: isSet(object.type) ? globalThis.String(object.type) : "",
      coordinates: globalThis.Array.isArray(object?.coordinates)
        ? object.coordinates.map((e: any) => globalThis.Number(e))
        : [],
      displayName: isSet(object.displayName) ? globalThis.String(object.displayName) : "",
    };
  },

  toJSON(message: User_Location): unknown {
    const obj: any = {};
    if (message.type !== "") {
      obj.type = message.type;
    }
    if (message.coordinates?.length) {
      obj.coordinates = message.coordinates;
    }
    if (message.displayName !== "") {
      obj.displayName = message.displayName;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<User_Location>, I>>(base?: I): User_Location {
    return User_Location.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<User_Location>, I>>(object: I): User_Location {
    const message = createBaseUser_Location();
    message.type = object.type ?? "";
    message.coordinates = object.coordinates?.map((e) => e) || [];
    message.displayName = object.displayName ?? "";
    return message;
  },
};

export type UserServiceService = typeof UserServiceService;
export const UserServiceService = {
  getUserById: {
    path: "/user.v2.UserService/GetUserById",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetUserByIdRequest) => Buffer.from(GetUserByIdRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetUserByIdRequest.decode(value),
    responseSerialize: (value: GetUserByIdResponse) => Buffer.from(GetUserByIdResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetUserByIdResponse.decode(value),
  },
  getUserByEmail: {
    path: "/user.v2.UserService/GetUserByEmail",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetUserByEmailRequest) => Buffer.from(GetUserByEmailRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetUserByEmailRequest.decode(value),
    responseSerialize: (value: GetUserByEmailResponse) => Buffer.from(GetUserByEmailResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetUserByEmailResponse.decode(value),
  },
} as const;

export interface UserServiceServer extends UntypedServiceImplementation {
  getUserById: handleUnaryCall<GetUserByIdRequest, GetUserByIdResponse>;
  getUserByEmail: handleUnaryCall<GetUserByEmailRequest, GetUserByEmailResponse>;
}

export interface UserServiceClient extends Client {
  getUserById(
    request: GetUserByIdRequest,
    callback: (error: ServiceError | null, response: GetUserByIdResponse) => void,
  ): ClientUnaryCall;
  getUserById(
    request: GetUserByIdRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetUserByIdResponse) => void,
  ): ClientUnaryCall;
  getUserById(
    request: GetUserByIdRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetUserByIdResponse) => void,
  ): ClientUnaryCall;
  getUserByEmail(
    request: GetUserByEmailRequest,
    callback: (error: ServiceError | null, response: GetUserByEmailResponse) => void,
  ): ClientUnaryCall;
  getUserByEmail(
    request: GetUserByEmailRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetUserByEmailResponse) => void,
  ): ClientUnaryCall;
  getUserByEmail(
    request: GetUserByEmailRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetUserByEmailResponse) => void,
  ): ClientUnaryCall;
}

export const UserServiceClient = makeGenericClientConstructor(UserServiceService, "user.v2.UserService") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): UserServiceClient;
  service: typeof UserServiceService;
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
