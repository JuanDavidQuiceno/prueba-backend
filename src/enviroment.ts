import * as dotenv from "dotenv";
dotenv.config({ path: `./.env` });

export class Environments {
    public static readonly PORT: number = parseInt(process.env.PORT || '4000', 10);
    public static readonly HOST: string = process.env.HOST || 'localhost';
    public static readonly PORT_DB: number = parseInt(process.env.PORT_DB || '3306', 10);
    public static readonly HOST_DB: string = process.env.HOST_DB || '127.0.0.1';
    public static readonly DB: string = process.env.DB || 'igoo';
    public static readonly USER_DB: string = process.env.USER_DB || 'root';
    public static readonly PASS_DB: string = process.env.PASS_DB || '12345678';
    public static readonly SECRET_KEY_JWT_API: string = process.env.SECRET_KEY_JWT_API || 'secretKey';
    public static readonly SECRET_KEY_JWT_FORGOT_PASSWORD: string = process.env.SECRET_KEY_JWT_FORGOT_PASSWORD || 'secretKeyForgot';
    public static readonly SHOW_LOGS: string = process.env.SHOW_LOGS || 'false';

    // AWS
    public static readonly AWS_ACCESS_KEY: string = process.env.AWS_ACCESS_KEY || '';
    public static readonly AWS_SECRET_ACCESS_KEY: string = process.env.AWS_SECRET_ACCESS_KEY || '';
    public static readonly AWS_REGION: string = process.env.AWS_REGION || '';
    public static readonly AWS_BUCKET: string = process.env.AWS_BUCKET || '';


    // Twilio
    public static readonly TWILIO_ACCOUNT_SID: string = process.env.TWILIO_ACCOUNT_SID || '';
    public static readonly TWILIO_AUTH_TOKEN: string = process.env.TWILIO_AUTH_TOKEN || '';
    public static readonly TWILIO_PHONE_NUMBER: string = process.env.TWILIO_PHONE_NUMBER || '';
    public static readonly MY_NUMBER: string = process.env.MY_NUMBER || '';


    // Método opcional para verificar si todas las variables necesarias están definidas
    public static checkRequiredVariables(): void {
        if (
            !Environments.PORT ||
            !Environments.HOST ||
            !Environments.PORT_DB ||
            !Environments.HOST_DB ||
            !Environments.DB ||
            !Environments.USER_DB ||
            !Environments.PASS_DB ||

            // JWT
            !Environments.SECRET_KEY_JWT_API ||

            // activar o desactivar los logs
            !Environments.SHOW_LOGS ||
            // AWS
            !Environments.AWS_ACCESS_KEY ||
            !Environments.AWS_SECRET_ACCESS_KEY ||
            !Environments.AWS_REGION ||
            !Environments.AWS_BUCKET
        ) {
            throw new Error('Faltan variables de entorno requeridas.');
        }
    }
}