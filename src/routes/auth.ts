import { Router, Request, Response } from "express";
import { check } from "express-validator";
import { AuthController } from "../controllers/auth";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { ValidateFields } from "../middleware/ValidateFields";


const router = Router();
const controller = new AuthController();
const authMiddleware = new AuthMiddleware().authorization;
const validateFields = new ValidateFields();

router.get(
    "/",
    [
        authMiddleware,
    ],
    (req: Request, res: Response) =>
        controller.userData(req, res)
);

router.post(
    "/login",
    [
        check('email').notEmpty().exists().isEmail().withMessage("El email es requerido"),
        check('password').notEmpty().exists().isLength({ min: 6, max: 20 }).withMessage("La contraseña es requerida"),
        validateFields.checkV2,
    ],
    (req: Request, res: Response) =>
        controller.login(req, res)
);

router.post(
    "/register",
    [
        check('name').notEmpty().exists().isString().withMessage("Nombre es requerido"),
        check('last_name').notEmpty().exists().isString().withMessage("Apellido es requerido"),
        check('email').notEmpty().exists().isEmail().withMessage("Email es requerido"),
        check('password').notEmpty().exists().isLength({ min: 6, max: 20 }).withMessage("Contraseña es requerida"),
        check('phone').notEmpty().exists().isNumeric().withMessage("Telefono es requerido"),
        validateFields.checkV2,
    ],
    (req: Request, res: Response) =>
        controller.register(req, res)
);

export default router;