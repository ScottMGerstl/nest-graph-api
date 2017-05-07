import { HttpException } from 'nest.js';

/**
 * Exception to indicate validation constraints have been violated. errors are retained on the exception
 *
 * @export
 * @class ValidationException
 * @extends {HttpException}
 */
export class ValidationException extends HttpException {
    validationErrors: any;

    constructor(message: string, validationErrors: any) {
        super(message, 422);
        this.validationErrors = validationErrors;
    }
}