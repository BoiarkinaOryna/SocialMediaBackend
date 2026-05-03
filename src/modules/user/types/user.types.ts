// import { type Prisma } from "@prisma/client";
import { type InferType } from "yup";
import { loginSchema, regSchema } from "../user.schema";
import { Prisma } from "@prisma/client";
export type User = Prisma.UserGetPayload<{
  omit: {
    password: true;
  };
}>;

export type CreateUserPayload = {
  email: string;
  password: string;
};

export type UserWithPassword = Prisma.UserGetPayload<{}>;

export type RegisterDto = {
  email: string;
  password: string;
};

export type LoginCredentials = InferType<typeof loginSchema>;
export type RegisterCredentials = InferType<typeof regSchema>;

export type MeDTO = {
  userId: number;
};
export type TokenDTO = {
  token: string;
};
export interface CreateProfileDTO {
  userId: number;
  username: string;
  pseudonym: string;
}

export interface UpdateMeDTO {
  userId: number;
  email?: string;
  username?: string;
  name?: string;
  surname?: string;
  avatar?: string;
  // birthDate?: string
}

export type registrationCodesType = {
  code: string;
  userEmail: string;
}


export interface VerifyCodeDTO {
  email: string;
  code: string;
}