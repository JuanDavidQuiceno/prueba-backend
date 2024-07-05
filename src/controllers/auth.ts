import { Request, Response } from "express";
import UsersModel, { IUsers, UserRelations } from "../models/users";
import { DataLanguage } from "../helper/language";
import { Model, Sequelize, Transaction } from "sequelize";
import { CustomToken } from "../helper/custom_token";
import { Connection } from "../db/connection";

export class AuthController {
    async userData(req: any, res: Response) {
        const language = res.locals.language; // Obtener el idioma de la solicitud
        try {
            const user = req.user;
            const userAuth = await UsersModel().findOne({
                where: {
                    id: user.id
                },
                attributes: { exclude: UserRelations.exclude }
            });
            if (!userAuth) {
                return res.status(400).json({
                    message: language === DataLanguage.en
                        ? 'Controlled error user data'
                        : language === DataLanguage.fr
                            ? 'Erreur contrôlée user data'
                            : 'Usuario no encontrado'
                });
            }
            return res.status(200).json(userAuth);
        } catch (error: any) {
            // Si hay error
            if (error.message) {
                return res.status(400).json({
                    message: language === DataLanguage.es
                        ? 'Error controlado user data'
                        : language === DataLanguage.fr
                            ? 'Erreur contrôlée user data'
                            : 'Controlled error user data'
                });
            }
            else {
                return res.status(500).json({
                    message: language === DataLanguage.es
                        ? 'Error controlado user data'
                        : language === DataLanguage.fr
                            ? 'Erreur contrôlée user data'
                            : 'Controlled error user data'
                });
            }
        }

    }

    async login(req: Request, res: Response) {
        const language = res.locals.language; // Obtener el idioma de la solicitud
        const { body } = req;
        try {
            // Obtiene datos del usuario
            const user: Model<IUsers, IUsers> | null = await UsersModel().findOne({
                where: {
                    email: body.email
                },
                attributes: {
                    include: ['id', 'password']
                }

            });

            // Si no existe el usuario
            if (!user) {
                return res.status(404).json({
                    title: 'Error title',
                    message: language === DataLanguage.en
                        ? 'You do not have an account yet, sign up'
                        : language === DataLanguage.fr
                            ? 'Vous n\'avez pas encore de compte, inscrivez-vous'
                            : 'Aún no tienes una cuenta, regístrate',
                }
                );
            }
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const bcrypt = require("bcryptjs");

            const compare = bcrypt.compareSync(body.password, user.dataValues.password);

            if (!compare) {
                return res.status(404).json({
                    title: 'Error title',
                    message: language === DataLanguage.en
                        ? 'Incorrect email or password. Try again or select\n"Forgot your password?"'
                        : language === DataLanguage.fr
                            ? 'Email ou mot de passe incorrect. Réessayer ou sélectionner\n"Mot de passe oublié?"'
                            : 'Correo o contraseña incorrecta.'
                }
                );
            }

            // Si no existe el usuario
            if (!compare) {
                return res.status(404).json({
                    title: language === DataLanguage.es
                        ? 'Error al iniciar sesión'
                        : language === DataLanguage.fr
                            ? 'Erreur de connexion'
                            : 'Login error',
                    message: language === DataLanguage.es
                        ? 'Correo o contraseña incorrecta. Vuelve a intentarlo o selecciona\n"¿Has olvidado tu contraseña?"'
                        : language === DataLanguage.fr
                            ? 'Email ou mot de passe incorrect. Réessayer ou sélectionner\n"Mot de passe oublié?"'
                            : 'Incorrect email or password. Try again or select\n"Forgot your password?"',
                });
            }

            const userAuth = await UsersModel().findOne({
                where: {
                    id: user.dataValues.id
                },
                attributes: { exclude: UserRelations.exclude }
            });
            // Generar token de login
            const token = await CustomToken.generate(user.dataValues.id?.toString(), language);

            return res.status(200).header({ 'Authorization': token }).json(userAuth);
        } catch (error: any) {
            // Si hay error
            if (error.message) {
                return res.status(400).json({ message: 'Error controlado auth', error: error.message });
            }
            else {
                return res.status(500).json({ message: 'Error controlado auth,', error: error });
            }
        }
    }

    async register(req: Request, res: Response) {
        const language = res.locals.language; // Obtener el idioma de la solicitud
        // iniciamos la transaccion
        let transaction: Transaction;
        try {
            const { body } = req;

            // verificamos que el correo no exista
            const userExiste = await UsersModel().findOne(
                {
                    where: {
                        email: body.email
                    }
                }
            );

            if (userExiste) {
                return res.status(400).json({
                    message: language === DataLanguage.es
                        ? 'El correo ya se encuentra registrado'
                        : language === DataLanguage.fr
                            ? 'L\'email est déjà enregistré'
                            : 'The email is already registered',
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const bcrypt = require("bcryptjs");
            const salt = bcrypt.genSaltSync(10);
            const pass = bcrypt.hashSync(body.password, salt);
            // Inicia una transacción
            transaction = await (Connection.getInstance().db as Sequelize).transaction();

            // registramos el usuario
            await UsersModel().create({
                email: body.email,
                password: pass,
                name: body.name,
                phone: body.phone
            }, { transaction });

            // Commit transaction
            await transaction.commit();

            return res.status(200).json({
                message: language === DataLanguage.es
                    ? 'Usuario registrado correctamente'
                    : language === DataLanguage.fr
                        ? 'Utilisateur enregistré avec succès'
                        : 'User registered successfully',
            });

        } catch (error: any) {

            //rollback si hay error a la transaccion
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (transaction!) await transaction?.rollback().catch(() => null);
            // Si hay error
            if (error.message) {
                return res.status(400).json({ message: 'Error controlado auth', error: error.message });
            }
            else {
                return res.status(500).json({ message: 'Error controlado auth,', error: error });
            }
        }
    }
}