import * as jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { DataLanguage } from "../helper/language";
import { ErrorClass } from "../helper/default_class";
import { Environments } from "../enviroment";

export class AuthMiddleware {

  // constructor() { }

  /**
   * Realiza la autorización
   */
  public authorization(req: any, res: Response, next: NextFunction) {
    const language = res.locals.language; // Obtener el idioma de la solicitud
    const jwtToken = req.header('Authorization');
    if (!jwtToken) return res.status(401).json(new ErrorClass(
      language === DataLanguage.es
        ? 'Token no encontrado'
        : language === DataLanguage.fr
          ? 'Jeton non trouvé'
          : 'Token not found'
    ));

    try {
      // const jwt = require('jsonwebtoken');
      const payload = jwt.verify(jwtToken, Environments.SECRET_KEY_JWT_API || '');
      req.user = payload;
      next();
    } catch (error) {
      res.status(400).json(new ErrorClass(
        language === DataLanguage.es
          ? 'Token invalido: ' + error
          : language === DataLanguage.fr
            ? 'Jeton invalide: ' + error
            : 'Invalid token: ' + error
      ));
    }
  }
}

