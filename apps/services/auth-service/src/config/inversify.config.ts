import { Container } from 'inversify';
import IUserRepository from '@/repositories/interfaces/IUserRepository';
import IAdminRepository from '@/repositories/interfaces/IAdminRepository';
import { UserRepository } from '@/repositories/user.repository';
import { AdminRepository } from '@/repositories/admin.repository';
import { AuthService } from '@/services/auth.service';
import { TYPES } from '@/types';
import { AuthController } from '@/controllers/auth.controller';
import { MailService } from '@/services/mail.service';
import { UserGrpcService } from '@/services/user.grpc.service';
import { GrpcClientProvider } from '@/grpc/user.client';

const container = new Container();

container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<MailService>(TYPES.MailService).to(MailService);
container.bind<UserGrpcService>(TYPES.UserGrpcService).to(UserGrpcService);
container.bind<GrpcClientProvider>(TYPES.GrpcClientProvider).to(GrpcClientProvider);

export { container };
