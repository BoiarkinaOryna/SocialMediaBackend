// import { type Prisma } from "@prisma/client";
import { type InferType } from "yup";
import { loginSchema, regSchema } from "../user.schema";
import { Prisma } from "@prisma/client";
type UserWithBigInt = Prisma.user_app_userGetPayload<{
  omit: {
    password: true;
  };
}>;

export type User = UserWithBigInt

// export type User = 
//   Omit<
//     UserWithBigInt,
//     "id"
//   > & {
//     id: number
//   }

export type CreateUserPayload = {
  email: string;
  password: string;
};

export type UserWithPassword = Prisma.user_app_userGetPayload<{}>;

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
  // name?: string;
  // surname?: string;
  avatar?: string;
  birthDate?: string
}

export type registrationCodesType = {
  code: string;
  userEmail: string;
}

export interface VerifyCodeDTO {
  email: string;
  code: string;
}

export type userWithProfile = {
  id: number,
  username: string | null,
  pseudonym?: string | null,
  birth_date?: string | null,
  email: string,
  signature?: string | null,
  avatar?: string | null,

  // id: number;
  // username: string | null;
  // email: string;
  // profile: {
  //     id: number;
  //     userId: number;
  //     pseudonym: string | null;
  //     birth_date: string | null;
  //     signature: string | null;
  //     avatar: string | null;
  //     is_image_signature: boolean;
  //     is_text_signature: boolean;
  // } | null;
}
export type GetOnlineUsersAcknowlegment = (response: {
	userIds: number[]
}) => void;