import { Request, Response, NextFunction } from "express";

// lenguaje: español, ingles, francés
// middleware/language.js
const supportedLanguages = ['en', 'es', 'fr']; // Idiomas admitidos

export class Language {

    public setLanguage(req: Request, res: Response, next: NextFunction) {
        req.acceptsLanguages(supportedLanguages);
        const language = req.headers['accept-language']?.toLowerCase();
        if (language && supportedLanguages.includes(language)) {
            res.locals.language = language;
        } else {
            // Establecer un idioma predeterminado si no se especifica o no es compatible
            res.locals.language = 'en';
        }
        next();
    }
}