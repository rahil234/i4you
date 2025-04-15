import {Container} from "inversify";
import IUserRepository from "@/repositories/interfaces/IUserRepository";
import {UserRepository} from "@/repositories/user.repository";
import {UserService} from "@/services/user.service";
import {TYPES} from "@/types";
import {UserController} from "@/controllers/user.controller";
import { UserGrpcService } from '@/grpc/grpc.user.service';

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserGrpcService>(TYPES.GrpcUserService).to(UserGrpcService);
container.bind<UserController>(TYPES.UserController).to(UserController);

export {container};