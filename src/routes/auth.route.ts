import express from "express";
import { validate } from "../middlewares/validate.middleware";
import { UserLoginSchema, UserSignUpSchema } from "../zod/schema";
import {
  GoogleAuth,
  GoogleAuthCallback,
  LoginUser,
  SignUpUser,
} from "../controllers/auth.controller";

const AuthRouter = express.Router();

AuthRouter.post("/signup", validate(UserSignUpSchema), SignUpUser);
AuthRouter.post("/login", validate(UserLoginSchema), LoginUser);
AuthRouter.get("/google", GoogleAuth);
AuthRouter.get("/google/callback", GoogleAuthCallback);

export default AuthRouter;
