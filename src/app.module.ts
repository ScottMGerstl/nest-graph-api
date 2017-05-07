import { Module } from 'nest.js';
import { UsersModule } from './apis/users/users.module';
import { AuthModule } from './framework/auth/auth.module';
import { AuthController } from './apis/auth/auth.controller';

@Module({
    modules: [UsersModule, AuthModule],
    controllers: [AuthController]
})
export class AppModule {}