import * as express from 'express';
import { Controller, Get, Post, Request, Response, Param, Body, HttpStatus, HttpException } from 'nest.js';
import { UsersService } from './users.service';
import { BaseController } from '../../types/base/base.controller';

declare var process;

@Controller('users')
export class UsersController extends BaseController {

    constructor(private usersService: UsersService) {
        super();
    }

    @Get()
    public async getAllUsers(@Response() res: express.Response) {
        try {
            const users = await this.usersService.getAllUsers();
            return res.status(HttpStatus.OK).json(users);
        }
        catch (err) {
           return this.createErrorResponse(res, err);
        }
    }

    @Get('/:id')
    public async getUser(@Response() res: express.Response, @Param('id') id) {
        try {
            const user = await this.usersService.getUser(+id);
            return res.status(HttpStatus.OK).json(user);
        }
        catch (err) {
           return this.createErrorResponse(res, err);
        }
    }

    @Post()
    public async addUser(@Response() res: express.Response, @Body('user') user) {
        try {
            const msg = await this.usersService.addUser(user);
            return res.status(HttpStatus.CREATED).json(msg);
        }
        catch (err) {
           return this.createErrorResponse(res, err);
        }
    }
}