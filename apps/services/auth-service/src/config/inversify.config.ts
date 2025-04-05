import { Container } from 'inversify';
import IAuthRepository from '@/repositories/interfaces/IAuthRepository';
import { AuthRepository } from '@/repositories/auth.repository';
import { AuthService } from '@/services/auth.service';
import { TYPES } from '@/types';
import { AuthController } from '@/controllers/auth.controller';

const container = new Container();

container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

export { container };
