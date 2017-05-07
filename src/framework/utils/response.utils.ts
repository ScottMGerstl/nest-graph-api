import { LoggingService } from '../logging/logging.service';
import * as express from 'express';
import { HttpException, HttpStatus } from 'nest.js';
import { ValidationException } from '../../types/exceptions';
import { ErrorResponse } from '../../types/responses/error.response';
import { InvalidResponse } from '../../types/responses/invalid.response';

export class ResponseUtils {

    /**
     * Handles resolving an exception into the correct type of error to send in the response
     *
     * @static
     * @param {express.Response} res
     * @param {*} err error to handle
     */
    public static createErrorResponse (res: express.Response, err: any) {
        let responseCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
        let responseMessage: string = null;
        let validationErrors: any = null;

        if(err instanceof HttpException) {
            let response: ErrorResponse = new ErrorResponse();

            // Be explicit in the information returned. Don't return a stack trace to a user.
            responseMessage = <string>err.getResponse();
            responseCode = err.getStatus();

            if (err instanceof ValidationException) {
                validationErrors = err.validationErrors;
            }
        }

        // If it was an unhandled error, log the error
        if (responseCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            LoggingService.log(err);
        }

        // create the response
        let response: ErrorResponse = validationErrors === null ? new InvalidResponse(validationErrors) : new ErrorResponse();
        response.message = responseMessage;

        return res.status(responseCode).json(response);
    }
}