import { Module } from 'nest.js';
import { AuthRepo } from './auth.repo';
import { JwtService } from './jwt.service';

@Module({
    components: [AuthRepo, JwtService],
    exports: [AuthRepo, JwtService]
})
export class AuthModule { }