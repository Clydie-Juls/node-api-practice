import { Router } from "express";
import { login, signup } from "../controllers/auth";
import { body } from "express-validator";
import { handleValidation } from "../middleware/validator";

const authRouter = Router();

const authValidation = [
  body("username").isString(),
  body("password").isString(),
  handleValidation,
];

authRouter.post("/login", authValidation, login);

authRouter.post("/signup", authValidation, signup);

export default authRouter;
