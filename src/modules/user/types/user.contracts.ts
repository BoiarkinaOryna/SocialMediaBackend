import type { NextFunction, Request, Response } from "express";
import type {
  CreateProfileDTO,
  CreateUserPayload,
  GetOnlineUsersAcknowlegment,
  LoginCredentials,
  MeDTO,
  RegisterCredentials,
  RegisterDto,
  TokenDTO,
  UpdateMeDTO,
  User,
  UserWithPassword,
  userWithProfile,
  VerifyCodeDTO,
} from "./user.types";
import { AuthenticatedUser } from "../../../types/token";
import { AuthenticatedSocket, ServerSocket, SocketController } from "../../../socket/socket.types";
// import { AuthenticatedUser } from "@app-types/token";

export interface UserService {
  login: (credentials: LoginCredentials) => Promise<TokenDTO>;
  register: (dto: RegisterDto) => Promise<any>;
  me: (DTO: MeDTO) => Promise<userWithProfile>;
  createProfile: (dto: CreateProfileDTO) => Promise<any>;
  updateMe: (dto: UpdateMeDTO) => Promise<any>;
  verifyCode: (data: VerifyCodeDTO) => Promise<any>;
}
export interface UserRepository {
  findByEmail: (email: string) => Promise<User | null>;
  findByUsername: (username: string) => Promise<User | null>;
  findByIdWithPassword: (id: number) => Promise<UserWithPassword | null>;
  findById: (id: number) => Promise<userWithProfile | null>;
  create: (data: CreateUserPayload) => Promise<User>;
  createProfile: (data: CreateProfileDTO) => Promise<any>;
  updateUserAndProfile: (data: UpdateMeDTO, profileId: number) => Promise<any>;
  findProfileIdByUserId: (userId: number) => Promise<number>
  createAvatarAlbum: (profileId: number) => Promise<void>;
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
    res: Response<userWithProfile, AuthenticatedUser>,
    next: NextFunction,
  ) => void;
  createProfile: (req: Request, res: Response, next: NextFunction) => void;

  updateMe: (req: Request, res: Response, next: NextFunction) => void;
  verifyCode:(req:Request, res: Response, next :NextFunction) => void;
}




export interface UserClientEvents {
	getOnlineUsers: (
		userIds: number[],
		ack?: GetOnlineUsersAcknowlegment,
	) => void;
}
export interface UserSocketControllerContract extends SocketController {
	getOnlineUsers: (
		ioServer: ServerSocket,
		socket: AuthenticatedSocket,
		userIds: number[],
		ack?: GetOnlineUsersAcknowlegment,
	) => void;
	isUserOnline: (ioServer: ServerSocket, id: number) => boolean;
}
