import { HttpException } from 'nest.js';

export class NotFoundException extends HttpException {
    public constructor (message: string) {
        super(message, 404);
    }
}