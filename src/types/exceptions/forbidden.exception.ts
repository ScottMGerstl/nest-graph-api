import { HttpException } from 'nest.js';

/**
 * Exception to indicate the failed attempt to access a resource that is nopt allowed to the accessor
 *
 * @export
 * @class ForbiddenException
 * @extends {HttpException}
 */
export class ForbiddenException extends HttpException {
    constructor() {
        super('You are not allowed to access this resource', 403);
    }
}