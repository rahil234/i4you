import { test, beforeAll } from 'vitest';
import {
  GetUserByEmailRequest,
  GetUserByEmailResponse,
  GetUserByIdRequest,
  GetUserByIdResponse, UpdateUserRequest, UpdateUserResponse,
  UserServiceClient, UserServiceServer,
  UserServiceService,
} from '../generated/user/v2/user';
import { credentials, handleUnaryCall, Server, ServerCredentials, UntypedHandleCall } from '@grpc/grpc-js';

let server: Server;

export interface UserPreferences {
  ageRange: [number, number];
  distance: number;
  gender: 'male' | 'female' | 'all';
  showMe: 'male' | 'female' | 'all';
  lookingFor: 'casual' | 'relationship' | 'friendship' | 'all';
}

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  password: string; // Optional for login
  onboardingCompleted: boolean; // Optional for login
  status: 'active' | 'suspended';
  bio: string;
  gender: 'male' | 'female' | 'other';
  photos: string[];
  role: 'admin' | 'member';
  onboarding?: boolean;
  interests: string[];
  stats?: {
    matches: number;
    likes: number;
    activeDays: number;
  };
  preferences: UserPreferences;
  location: {
    type: 'Point';
    coordinates: [number, number];
    displayName: string;
  };
  joined: string;
  updatedAt: string;
  createdAt: string;
}

const user: User = {
  id: 'user1234',
  name: 'Test User',
  role: 'member',
  onboarding: true,
  onboardingCompleted: true,
  password: 'password',
  preferences: {
    ageRange: [18, 35],
    distance: 50,
    gender: 'all',
    showMe: 'all',
    lookingFor: 'relationship',
  },
  email: '',
  age: 0,
  location: {
    type: 'Point',
    coordinates: [0, 0],
    displayName: 'Test Location',
  },
  joined: new Date().toISOString(),
  gender: 'male',
  bio: '',
  photos: [],
  interests: [],
  status: 'suspended',
  createdAt: '',
  updatedAt: '',
};

class UserService implements UserServiceServer {
  [name: string]: UntypedHandleCall;

  getUserById: handleUnaryCall<GetUserByIdRequest, GetUserByIdResponse> = (call, callback) => {
    console.log('Received request to get user:', call.request.id);
    callback(null, user);
  };

  getUserByEmail: handleUnaryCall<GetUserByEmailRequest, GetUserByEmailResponse> = (call, callback) => {

  };

  createUser: handleUnaryCall<GetUserByEmailRequest, GetUserByEmailResponse> = (call, callback) => {
    console.log('Received request to create user:', call.request);
    callback(null, user);
  };

  updateUser: handleUnaryCall<UpdateUserRequest, UpdateUserResponse> = (call, callback) => {
    console.log('Received request to update user:', call.request);
    callback(null, user);
  };
}

beforeAll(async () => {
  server = new Server();

  server.addService(UserServiceService, new UserService());

  await new Promise<void>((resolve, reject) => {
    server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), (err, port) => {
      if (err) {
        console.error('Failed to bind:', err);
        reject(err);
      } else {
        console.log(`Server running on port ${port}`);
        resolve();
      }
    });
  });
});

test('gRPC user-service responds correctly', async () => {
  const client = new UserServiceClient('localhost:50051', credentials.createInsecure());

  await new Promise<void>((resolve, reject) => {
    client.createUser({
      name: 'Test User',
      email: 'r@gmail.com',
      password: 'password',
    }, (err, res) => {
      if (err) return reject(err);
      console.log('Response from gRPC:', res);
      resolve();
    });
  });
});
