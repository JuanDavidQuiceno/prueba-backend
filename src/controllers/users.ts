import { Response, Request, NextFunction } from "express";

import { Utils } from "../helper/utils";
import UsersModel from "../models/users";

export class Controller {
  async getAll(req: Request, res: Response, next: NextFunction) {
    new Utils().getAll(req, res, next, UsersModel());
  }

  async get(req: Request, res: Response, next: NextFunction) {
    new Utils().get(req, res, next, UsersModel());
  }

  async add(req: Request, res: Response, next: NextFunction) {
    new Utils().add(req, res, next, UsersModel());
  }

  async update(req: Request, res: Response, next: NextFunction) {
    new Utils().update(req, res, next, UsersModel());
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    new Utils().delete(req, res, next, UsersModel());
  }
}