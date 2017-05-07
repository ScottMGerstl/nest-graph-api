import { Module, MiddlewaresConsumer} from 'nest.js';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { AuthModule } from '../../framework/auth/auth.module';
import { AuthHandler } from '../../framework/server/auth.handler';

@Module({
    controllers: [UsersController],
    components: [UsersService],
    modules: [AuthModule]
})
export class UsersModule {
    public configure(mw: MiddlewaresConsumer) {
        mw.apply(AuthHandler).forRoutes(UsersController);
    }
}