export interface IException extends Error {
    statusCode: number;
    rawErrors?: string[];
}

export class Exception extends Error implements IException {
    statusCode: number;
    rawErrors: string[];
    constructor(statusCode: number, message: string, rawErrors?: string[]) {
        super(message);
        this.statusCode = statusCode;
        if (rawErrors) {
            this.rawErrors = rawErrors;
        }
        Error.captureStackTrace(this, this.constructor);
    }
}
