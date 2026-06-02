import type { NextFunction, Request, Response } from "express";
import type { UserController as UserControllerContract } from "./types/user.contracts";
import type {
  TokenDTO,
  LoginCredentials,
  RegisterCredentials,
} from "./types/user.types";
import { UserService } from "./user.service";
// import { ValidationError } from "@errors/app.errors";

export const UserController: UserControllerContract = {
  login: async function (
    req: Request<object, TokenDTO, LoginCredentials>,
    res: Response<TokenDTO>,
    next,
  ) {
    try {
      console.log("login body", req.body)
      const token = await UserService.login(req.body);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  },
  register: async function (
    req: Request<object, TokenDTO, RegisterCredentials>,
    res: Response,
    next,
  ) {
    try {
      await UserService.register({
        ...req.body,
        // avatar: req.file?.filename,
      });
      res.status(200).json("User is created");
    } catch (error) {
      next(error);
    }
  },
  me: async function (_, res, next) {
    try {
      const user = await UserService.me({ userId: res.locals.userId });
      res.status(200).json(user);
    } catch (error) {
      next(error); 
    }
  },
  createProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await UserService.createProfile({
        userId: res.locals.userId,
        ...req.body,
      });
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  },

  updateMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserService.updateMe({
        userId: res.locals.userId,
        ...req.body,
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  verifyCode: async (req, res, next) => {
  try {
    const result = await UserService.verifyCode(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
};
