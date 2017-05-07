import { Middleware, NestMiddleware } from 'nest.js';
import { JwtService } from '../auth/jwt.service';
import { EncodingUtils } from '../utils/encoding.utils';
import { UnauthorizedException, ForbiddenException } from '../../types/exceptions';
import { JwtPayload } from '../auth/jwt.interface';
import { ResponseUtils } from '../../framework/utils/response.utils';

import * as moment from 'moment';
import * as express from 'express';

@Middleware()
export class AuthHandler implements NestMiddleware {
    constructor(private jwtService: JwtService) { }

    /**
     * Implementation of NestMiddleware
     *
     * @memberOf AuthHandler
     */
    public resolve() {
        return (req, res, next) => {
            this.verifyAuthentication(req, res, next);
        }
    }
    /**
     * Use this to verify authentication in the express server
     *
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {Express.NextFunction} next
     */
    public verifyAuthentication(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            // Parse token
            let tokenParts: TokenParts = this.parseAuthenticationHeader(req);

            // Check the token for tampering
            let payloadPart: string = this.comparePayloadWithSignature(tokenParts);

            // Parse the payload
            let payload: JwtPayload = EncodingUtils.base64Decode<JwtPayload>(payloadPart);

            // Check if the token is in effective range
            this.checkEffectiveRange(payload);

            // check for the accountId
            if (!payload.sub) {
                throw new UnauthorizedException();
            }

            // add accountId to request for easy handling
            req.body.accountId = payload.sub;

            // continue
            next();
        }
        catch (err) {
            // Resolve any unknown errors
            if (err instanceof UnauthorizedException === false && err.name instanceof ForbiddenException === false) {
                err = new UnauthorizedException();
            }

            // Send the response
            return ResponseUtils.createErrorResponse(res, err);
        }
    }

    /**
     * parses the token and verifies its form
     *
     * @private
     * @param {express.Request} req the request the token is in
     * @returns {TokenParts} the parts of the token {header, paylod, signature}
     *
     * @memberOf AuthHandler
     */
    private parseAuthenticationHeader(req: express.Request): TokenParts {
        if (!req.headers['authorization']) {
            throw new UnauthorizedException('The authorization header is missing from the request headers');
        }

        let headerValues: string[] = req.headers['authorization'].split(' ');

        if (headerValues.length !== 2) {
            throw new UnauthorizedException('The authorization header is not well formed');
        }

        if (headerValues[0] !== 'Bearer') {
            throw new UnauthorizedException('The authorization header requires the Bearer schema');
        }

        let token: string = headerValues[1];

        if (token !== undefined && token !== null && token.length > 0) {
             let parts: string[] = token.split('.');

            if (parts.length === 3) {
                let tokenParts: TokenParts = new TokenParts();

                tokenParts.header = parts[0];
                tokenParts.payload = parts[1];
                tokenParts.signature = parts[2];

                return tokenParts;
            }
        }

        throw new UnauthorizedException('The authorization header requires a valid token');
    }
    /**
     * Checkt he header and payload against the signature to ensure no tampering was done to the token
     *
     * @private
     * @param {TokenParts} tokenParts the header, payload, and signature of the token split apart
     * @returns {string}
     *
     * @memberOf AuthHandler
     */
    private comparePayloadWithSignature(tokenParts: TokenParts): string {
        if (this.jwtService.getTokenSignature(tokenParts.header + '.' + tokenParts.payload) === tokenParts.signature) {
            return tokenParts.payload;
        }
        else {
            throw new UnauthorizedException();
        }
    }

    /**
     * Checks to make sure the token is effective by being between the iat and exp claims
     *
     * @private
     * @param {JwtPayload} payload the information of the token
     *
     * @memberOf AuthHandler
     */
    private checkEffectiveRange(payload: JwtPayload): void {
        let now = moment().utc().unix();

        if (now < payload.iat) {
            throw new UnauthorizedException('this token is not yet effective');
        }

        if (payload.exp < now) {
            throw new UnauthorizedException('this token has expired');
        }
    }
}

class TokenParts {
    public header: string;
    public payload: string;
    public signature: string;
}