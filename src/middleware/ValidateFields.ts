import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export class ValidateFields {

    // constructor() {}

    /**
     * Realiza la autorización
     */

    public check = (req: Request, res: Response, next: NextFunction) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const language = res.locals.language;
            return res.status(400).json({
                success: false,
                language: language,
                errors: errors.array()
            });
        }
        next();
    };

    public checkV2 = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        // // verificamos en que lugar se requiere el parametro
        // const location = errors.array().map(error => error.location);
        // // verificamos si el parametro es requerido
        // const required = errors.array().map(error => error.value);
        // // verificamos el tipo de dato que se requiere
        // const type = errors.array().map(error => error.msg);
        // // verificamos el nombre del parametro
        // const field = errors.array().map(error => error.param);

        if (!errors.isEmpty()) {
            const language = res.locals.language; // Obtener el idioma de la solicitud
            // const errorMessages = errors.array().map(error => ({
            //     message: this.getErrorMessage(error.msg, language),
            //     field: error.param
            // }));

            return res.status(400).json({
                success: false,
                language: language,
                errors: errors.array(),
                // errors: errorMessages,
            });
        }

        next();
    };
}