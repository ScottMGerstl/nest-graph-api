import { ErrorResponse } from './error.response';

export class InvalidResponse extends ErrorResponse {
    public errors: any[];

    constructor(errors: any) {
        super();
        this.errors = errors
    }
}