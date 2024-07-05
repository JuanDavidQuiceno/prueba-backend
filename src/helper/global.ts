/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from "./common";

/** Type for used into paged response */
export interface PageResponse<T> {
    data: T[];
    meta: {
        total: number,
        page: number
    }
}

/** Type for used into all request */
export interface IRequest extends Request {
    logger?: Logger;
}

/** Type for request error */
export class IError {
    public statusCode: number;
    public error: any;
    public contentType: string;

    constructor(config: {
        statusCode: number,
        error: any,
        contentType: string,
    }) {
        this.statusCode = config.statusCode;
        this.error = config.error;
        this.contentType = config.contentType;
    }
}
