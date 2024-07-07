/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import { Sequelize, Transaction } from "sequelize";
import { Connection } from "../../src/db/connection";
import { Common } from "../helper/common";
import { DataLanguage } from "./language";
import { ErrorClass, SuccessClass } from "./default_class";

export class Utils {
  public paginate(req: Request<any, any, any, any, any>) {
    const page: number = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit: number = req.query.limit
      ? parseInt(req.query.limit as string)
      : 100;
    const offset = (page - 1) * limit;
    const where: any = new Common().setWhere(req.query, req.query.op);

    return { page, limit, offset, where };
  }

  public errorCatch(error: any, next: NextFunction, res: Response) {
    new Common().showLogMessage("Error controlado", error, "error");

    if (error.message) {
      return res.status(500).json({
        message: error.message,
        success: false,
        code: error.code,
      });
    } else {
      const language = res.locals.language;
      return res.status(500).json(new ErrorClass(
        language === DataLanguage.es
          ? "Ha ocurrido un error en nuestro sistema, intenta nuevamente"
          : language === DataLanguage.fr
            ? "Une erreur s'est produite dans notre système, réessayez"
            : "An error has occurred in our system, please try again",

      ));
    }
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
    model: any,
    action: any = {},
  ) {
    try {
      if (req.query.page === undefined || req.query.limit === undefined) {
        const results = await model.findAll(action);

        return res.status(200).json(new SuccessClass('', results));
      } else {
        const { page, limit, offset } = new Utils().paginate(req);

        const results = await model.findAndCountAll({
          // where,
          limit,
          offset,
          action
        });

        const response = {
          result: results,
          meta: {
            total: results.count,
            page,
          },
        };
        return res.status(200).json(new SuccessClass('', response));
      }
    } catch (error) {
      return this.errorCatch(error, next, res);
    }
  }

  async get(req: Request, res: Response, next: NextFunction, model: any, action: any = {},) {
    try {
      const { id } = req.params;
      const reg = await model.findByPk(id, action);

      if (!reg) {
        const language = res.locals.language;
        return res.status(404).json(new ErrorClass(
          language === DataLanguage.es
            ? `No se encuentra el recurso solicitado con el id ${id}`
            : language === DataLanguage.fr
              ? `La ressource demandée avec l'identifiant ${id} n'a pas été trouvée`
              : `The requested resource with id ${id} was not found`
        ));
      }
      return res.status(200).json(new SuccessClass('', reg));
    } catch (error) {
      return this.errorCatch(error, next, res);
    }
  }

  async add(req: any, res: Response, next: NextFunction, model: any) {
    // const { body } = req is Request ?req: req.body;
    // verificar si el req es de tipo Request o es un objeto
    const body = req instanceof Request ? req.body : req;
    let transaction: Transaction;

    try {
      // Inicia una transacción
      transaction = await (
        Connection.getInstance().db as Sequelize
      ).transaction();

      const reg = await model.create(body, { transaction });

      // Commit a los cambios
      await transaction.commit();

      return res.status(200).json(new SuccessClass('', reg));
    } catch (error) {
      // Rollback a los cambios
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (transaction!) await transaction?.rollback().catch(() => null);
      return this.errorCatch(error, next, res);
    }
  }

  async update(req: Request, res: Response, next: NextFunction, model: any) {
    // const { id } = req.params;
    // sacar id de los params
    const { id } = req.params;
    const { body } = req;
    let transaction: Transaction;

    try {
      const reg = await model.findByPk(id);
      if (!reg) {
        const language = res.locals.language;
        return res.status(404).json(new ErrorClass(
          language === DataLanguage.es
            ? `No se encuentra el recurso solicitado con el id ${id}`
            : language === DataLanguage.fr
              ? `La ressource demandée avec l'identifiant ${id} n'a pas été trouvée`
              : `The requested resource with id ${id} was not found`
        ));
      }

      // Inicia una transacción
      transaction = await (
        Connection.getInstance().db as Sequelize
      ).transaction();

      await reg.update(body, {
        where: { id },
        transaction,
      });

      // Commit a los cambios
      await transaction.commit();

      return res.status(200).json(new SuccessClass('', reg));
    } catch (error) {
      // Rollback a los cambios
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (transaction!) await transaction?.rollback().catch(() => null);
      return this.errorCatch(error, next, res);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction, model: any) {
    const { id } = req.params;
    let transaction: Transaction;

    try {
      const reg = await model.findByPk(id);
      const language = res.locals.language;
      if (!reg) {
        return res.status(404).json(new ErrorClass(
          language === DataLanguage.es
            ? `No se encuentra el recurso solicitado con el id ${id}`
            : language === DataLanguage.fr
              ? `La ressource demandée avec l'identifiant ${id} n'a pas été trouvée`
              : `The requested resource with id ${id} was not found`,
        ));
      }

      // Inicia una transacción
      transaction = await (
        Connection.getInstance().db as Sequelize
      ).transaction();

      // Eliminación fisica
      await reg.destroy({ transaction });

      // Commit a los cambios
      await transaction.commit();

      return res.status(200).json(new SuccessClass(
        language === DataLanguage.es
          ? `El registro con el ID ${id} ha sido eliminado`
          : language === DataLanguage.fr
            ? `L'enregistrement avec l'ID ${id} a été supprimé`
            : `The record with ID ${id} has been deleted`,
      ));
    } catch (error) {
      // Rollback a los cambios
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (transaction!) await transaction?.rollback().catch(() => null);
      return this.errorCatch(error, next, res);
    }
  }
}
