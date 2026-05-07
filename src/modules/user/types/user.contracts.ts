  import type { NextFunction, Request, Response } from "express";
  import type {
    CreateProfileDTO,
    CreateUserPayload,
    LoginCredentials,
    MeDTO,
    RegisterCredentials,
    RegisterDto,
    TokenDTO,
    UpdateMeDTO,
    User,
    UserWithPassword,
    VerifyCodeDTO,
  } from "./user.types";
  import { AuthenticatedUser } from "../../../types/token";
  // import { AuthenticatedUser } from "@app-types/token";

  export interface UserService {
    login: (credentials: LoginCredentials) => Promise<TokenDTO>;
    register: (dto: RegisterDto) => Promise<any>;
    me: (DTO: MeDTO) => Promise<User>;
    createProfile: (dto: CreateProfileDTO) => Promise<any>;
    updateMe: (dto: UpdateMeDTO) => Promise<any>;
    verifyCode: (data: VerifyCodeDTO) => Promise<any>;
  }
  export interface UserRepository {
    findByEmail: (email: string) => Promise<User | null>;
    findByUsername: (username: string) => Promise<User | null>;
    findByIdWithPassword: (id: number) => Promise<UserWithPassword | null>;
    findById: (id: number) => Promise<User | null>;
    create: (data: CreateUserPayload) => Promise<User>;
    createProfile: (data: CreateProfileDTO) => Promise<any>;
    updateUserAndProfile: (data: UpdateMeDTO, profileId: number) => Promise<any>;
    findProfileIdByUserId: (userId: number) => Promise<number>
  }

  export interface UserController {
    login: (
      req: Request<object, TokenDTO, LoginCredentials>,
      res: Response<TokenDTO>,
      next: NextFunction,
    ) => void;
    register: (
      req: Request<object, TokenDTO, RegisterCredentials>,
      res: Response<TokenDTO>,
      next: NextFunction,
    ) => void;
    me: (
      req: Request<object, object, object, object, AuthenticatedUser>,
      res: Response<User, AuthenticatedUser>,
      next: NextFunction,
    ) => void;
    createProfile: (req: Request, res: Response, next: NextFunction) => void;

    updateMe: (req: Request, res: Response, next: NextFunction) => void;
    verifyCode:(req:Request, res: Response, next :NextFunction) => void;
  }
