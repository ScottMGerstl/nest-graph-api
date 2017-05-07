import { Component } from 'nest.js';
import * as moment from 'moment';
import * as crypto from 'crypto';

declare var process;

import { EncodingUtils } from '../utils/encoding.utils';
import { JwtHeader, JwtPayload } from './jwt.interface';

@Component()
export class JwtService {

    constructor() { }

    public createToken(accountId: number): string {

        let header: JwtHeader = {
            type: 'JWT',
            tkv: '0'
        };

        let payload: JwtPayload = {
            iss: process.env.TOKEN_ISSUER,
            sub: accountId,
            iat: moment().utc().unix(),
            exp: moment().utc().add(process.env.TOKEN_DAYS_VALID, 'days').unix()
        };

        let encodedHeader: string = EncodingUtils.base64Encode(header);
        let encodedPayload: string = EncodingUtils.base64Encode(payload);

        let unsignedToken: string = encodedHeader + '.' + encodedPayload;

        let signedToken: string = unsignedToken + '.' + this.getTokenSignature(unsignedToken);

        return signedToken;
    }

    public getTokenSignature(unsignedToken: string): string {
        let secret = process.env.TOKEN_SECRET;

        let hash = crypto.createHmac('sha512', secret);
        hash.update(unsignedToken);
        let signature: string = hash.digest('base64');

        return signature;
    }
}