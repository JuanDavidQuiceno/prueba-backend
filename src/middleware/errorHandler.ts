import { Response, NextFunction } from "express";

export class ErrorMiddleware {
    public logRequestMiddleware = (req: any, _: Response, next: NextFunction) => {
        try {
            const { method, url, body, query, params, header } = req;
            const { user } = req;
            const log = {
                method,
                url,
                header,
                query,
                body,
                params,
                user,
            };
            console.log('Request received', JSON.stringify(log));
        } catch (error) {
            console.log("Error in logRequestMiddleware", error);
        } finally {
            next();
        }
    };
}
