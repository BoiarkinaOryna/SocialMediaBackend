import { Router } from "express";
import { UserController } from "./user.controller";
// import { validateMiddleware } from "@middlewares/validate.middleware";
import { loginSchema, regSchema } from "./user.schema";
import { authenticateMiddleware, validateMiddleware } from "../../middlewares";
import {
  processImageMiddleware,
  uploadMiddleware,
} from "../../middlewares/upload";
// import { authenticateMiddleware } from "@middlewares/authenticate.middleware";
// import { processImageMiddleware, uploadMiddleware } from "@middlewares/upload";

export const UserRouter = Router();

UserRouter.post(
  "/login",
  validateMiddleware(loginSchema),
  UserController.login,
);
UserRouter.post(
  "/register",
  uploadMiddleware.single("avatar"),
  validateMiddleware(regSchema),
  processImageMiddleware(false, 400, 80),
  UserController.register,
);
UserRouter.post(
  "/profile",
  authenticateMiddleware,
  UserController.createProfile,
);

UserRouter.patch("/me", authenticateMiddleware, UserController.updateMe);
UserRouter.get("/me", authenticateMiddleware, UserController.me);
UserRouter.post("/verify", UserController.verifyCode);