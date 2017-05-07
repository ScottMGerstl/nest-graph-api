import { HttpException } from 'nest.js';

/**
 * Exception to indicate the failed attempt to access an authorized resource
 *
 * @export
 * @class UnauthorizedException
 * @extends {HttpException}
 */
export class UnauthorizedException extends HttpException {
    constructor(message?: string) {
        super(message || 'You are not authorized to access this resource', 401);
    }
}