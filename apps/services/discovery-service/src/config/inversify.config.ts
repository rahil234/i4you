import { Container } from 'inversify';
import { TYPES } from '@/types';
import { DiscoveryService } from '@/services/discovery.service';

const container = new Container();

container.bind<DiscoveryService>(TYPES.DiscoverService).to(DiscoveryService);

export { container };
