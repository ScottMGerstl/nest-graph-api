import * as bcrypt from 'bcryptjs';

import { Controller, Get, Post, Request, Response, Param, Body, HttpStatus, HttpException } from 'nest.js';
import * as Express from 'express';

import { BaseController } from '../../types/base/base.controller';
import { UnauthorizedException } from '../../types/exceptions';

import { JwtService } from '../../framework/auth/jwt.service';
import { AuthRepo } from '../../framework/auth/auth.repo';

import { AuthResponse } from './auth.response';

@Controller('auth')
export class AuthController extends BaseController {

    constructor(private _jwtService: JwtService, private _authRepo: AuthRepo) {
        super();
    }

    @Post('/register/email')
    public async registerByEmail(req: Express.Request, res: Express.Response) {
        try {
            // Validate
            let validData: any = req.body; // validation.validateRegisterByEmail(req.body);

            // Prep password
            let hash: string = this.hashPassword(validData.password);

            // trandorm for database
            let accountModel: any = {
                name: validData.name,
                email: validData.email,
                passwordHash: hash
            };

            // insert
            let accountId = await this._authRepo.createAccount(accountModel);

            let response: AuthResponse = this.createResponse(accountId);
            return res.status(201).json(response);
        }
        catch (err) {
            return this.createErrorResponse(err, res);
        }
    };

    @Post('/signin/email')
    public async signInByEmail(req: Express.Request, res: Express.Response) {
        let failedSignInMessage: string = 'Either the email or password is incorrect';

        try {
            // Validate
            let validData: any = req.body; // validation.validateSignInByEmail(req.body);

            let account = await this._authRepo.getAccountByEmail(validData.email)

            // check password
            let match: boolean = this.compare(validData.password, account.passwordHash);

            if (match === false) {
                throw new UnauthorizedException(failedSignInMessage);
            }

            // create response
            let response: AuthResponse = this.createResponse(account.Id);
            return res.status(200).json(response);
        }
        catch (err) {
            return this.createErrorResponse(err, res);
        }
    }

    private createResponse(accountId: number): AuthResponse {
        // create token
        let token: string = this._jwtService.createToken(accountId);

        // create response
        let response: AuthResponse = {
            token: token
        };

        return response;
    }

    private hashPassword(password): string {
        let salt: string = bcrypt.genSaltSync(10);
        let hash: string = bcrypt.hashSync(password, salt);

        return hash;
    };

    private compare(password, hash): boolean {
        return bcrypt.compareSync(password, hash);
    };
};