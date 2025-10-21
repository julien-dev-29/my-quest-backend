import { NextFunction, Request, Response, Router } from "express";
import authController from "../controllers/authController";

const authRouter = Router()

authRouter.get('/login', authController.authGet)
authRouter.post('/login', authController.login);
authRouter.get('/register', authController.registerGet)
authRouter.post('/register', authController.registerPost)
authRouter.get('/logout', authController.logout)

export default authRouter