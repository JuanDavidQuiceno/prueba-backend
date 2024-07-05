import { Router, Request, Response, NextFunction } from "express";
import { Controller } from "../controllers/videos";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { ValidateFields } from "../middleware/ValidateFields";
import { check } from "express-validator";

const router = Router();
const controller = new Controller();
const authMiddleware = new AuthMiddleware().authorization;
const validateFields = new ValidateFields();

router.get(
  "/", [
  authMiddleware,
], (req: Request, res: Response, next: NextFunction) =>
  controller.getAll(req, res, next)
);

router.get(
  "/me", [
  authMiddleware,
], (req: Request, res: Response, next: NextFunction) =>
  controller.getAllMyVideos(req, res, next)
);

router.post(
  "/", [
  authMiddleware,
  check('title').notEmpty().exists().isString().withMessage("title is required"),
  check('description').notEmpty().exists().isString().withMessage("description is required"),
  validateFields.checkV2,
],
  (req: Request, res: Response, next: NextFunction) =>
    controller.add(req, res)
);

router.delete(
  "/:id", [
  authMiddleware,
],
  (req: Request, res: Response, next: NextFunction) =>
    controller.delete(req, res, next)
);

export default router;
