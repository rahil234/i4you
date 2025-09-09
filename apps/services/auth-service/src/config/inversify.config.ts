import { Container } from 'inversify';
import IUserRepository from '@/repositories/interfaces/IUserRepository';
import IAdminRepository from '@/repositories/interfaces/IAdminRepository';
import { UserRepository } from '@/repositories/user.repository';
import { AdminRepository } from '@/repositories/admin.repository';
import { AuthService } from '@/services/auth.service';
import { TYPES } from '@/types';
import { AuthController } from '@/controllers/auth.controller';
import { MailService } from '@/services/mail.service';
import { CacheService } from '@/services/cache.service';
import { UserGrpcService } from '@/services/user.grpc.service';
import { GrpcClientProvider } from '@/providers/grpc.client.provider';
import ICacheService from '@/services/interfaces/ICacheService';
import { IAuthService } from '@/services/interfaces/IAuthService';
import { IMailService } from '@/services/interfaces/IMailService';

const container = new Container();

container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IMailService>(TYPES.MailService).to(MailService);
container.bind<ICacheService>(TYPES.CacheService).to(CacheService);
container.bind<UserGrpcService>(TYPES.UserGrpcService).to(UserGrpcService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container
  .bind<GrpcClientProvider>(TYPES.GrpcClientProvider)
  .to(GrpcClientProvider)
  .inSingletonScope();

export { container };
