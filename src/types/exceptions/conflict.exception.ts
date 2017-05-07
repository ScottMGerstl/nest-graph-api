import { HttpException } from 'nest.js';

/**
 * Exception to indicate the dicovery of more than one resource when only one was expected
 *
 * @export
 * @class ConflictException
 * @extends {HttpException}
 */
export class ConflictException extends HttpException {
    constructor(message: string) {
        super(message, 409);
    }
}