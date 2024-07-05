import * as jwt from "jsonwebtoken";
import { Environments } from "../enviroment";


export class CustomToken {
    private static getSecretKey(): string {
        const secretKey: string = Environments.SECRET_KEY_JWT_API;
        if (!secretKey) {
            throw new Error('La clave secreta no está definida en las variables de entorno.');
        }
        return secretKey;
    }

    private static getSecretForgot(): string {
        const secretKey: string = Environments.SECRET_KEY_JWT_FORGOT_PASSWORD;
        if (!secretKey) {
            throw new Error('La clave secreta no está definida en las variables de entorno.');
        }
        return secretKey + 'temp';
    }



    public static async geneateExpire(privateKey: string, userId: string, expiresIn?: string, language?: string): Promise<string> {
        try {
            // const jwt = require('jsonwebtoken');
            const token = jwt.sign(
                {
                    "id": userId,
                },
                privateKey,
                {
                    algorithm: "HS256",
                    // expiracion en 10 minutos
                    expiresIn: !expiresIn ? '10m' : expiresIn
                },
            );

            return token;
        } catch (error) {
            throw new Error(language === 'es'
                ? 'Error al generar el token: ' + error
                : language === 'fr'
                    ? 'Erreur lors de la génération du jeton: ' + error
                    : 'Error generating token: ' + error,
            );
        }
    }

    public static async generate(userId?: string, language?: string): Promise<string> {
        try {
            const privateKey: string = CustomToken.getSecretKey();
            const token = jwt.sign(
                {
                    "id": userId,
                },
                privateKey,
                {
                    algorithm: "HS256",

                },
            );

            return token;
        } catch (error) {
            throw new Error(language === 'es'
                ? 'Error al generar el token: ' + error
                : language === 'fr'
                    ? 'Erreur lors de la génération du jeton: ' + error
                    : 'Error generating token: ' + error,
            );
        }
    }
}
