import { UserService as ServiceContract } from "./types/user.contracts";
import { UserRepository } from "./user.repository";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { env } from "../../config/env";
import { CreateUserPayload, RegisterDto, registrationCodesType, VerifyCodeDTO } from "./types/user.types";
import { NotFoundError } from "../../errors";
import { AuthenticationError, ConflictError } from "../../errors/app.errors";
import { PRISMA_CLIENT } from "../../config/client";
import nodemailer from "nodemailer";

// const RegistrationCodes: registrationCodesType[] = []

export const UserService: ServiceContract = {
  login: async (credentials) => {
    console.log("email in login", credentials.email)
    const user = await UserRepository.findByEmail(credentials.email);
    if (!user) {
      throw new NotFoundError("User");
    }
    // if (!user.isVerified) {
    //   throw new AuthenticationError("Email not verified");
    // }
    const userWithPassword = await UserRepository.findByIdWithPassword(Number(user.id));
    if (!userWithPassword) {
      throw new NotFoundError("User");
    }

    const isMatched = await compare(
      credentials.password,
      userWithPassword.password,
    );

    if (!isMatched) {
      throw new AuthenticationError(`Passwords aren't match`);
    }

    const token = sign(
      {
        id: Number(userWithPassword.id),
      },
      env.SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );
    console.log("user.id", Number(user.id), token)
    return { token };
  },
  register: async (credentials) => {
    // const existingUserByEmail = await UserRepository.findByEmail(
    //   credentials.email,
    // );
    // if (existingUserByEmail) {
    //   throw new ConflictError(`User with email ${credentials.email}`);
    // }

    const hashedPassword = await hash(credentials.password, 10);

    const userToCreate: CreateUserPayload = {
      ...credentials,
      password: hashedPassword,
    };

    const user = await UserRepository.create(userToCreate);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // await PRISMA_CLIENT.user_app_emailverification.create({
    //   data: {
    //     userId: user.id,
    //     code,
    //     expires_at: new Date(Date.now() + 10 * 60 * 1000), 
    //   },
    // });
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: env.EMAIL,
        pass: env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Your App" <${env.EMAIL}>`,
      to: credentials.email,
      subject: "Verification code",
      text: `Your code: ${code}`,
    });

    return "EMAIL_SENT";
  },
  me: async (DTO) => {
    const user = await UserRepository.findById(DTO.userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  },
  createProfile: async (dto) => {
    const profile = await UserRepository.createProfile(dto);
    await UserRepository.createAvatarAlbum(profile.id)
    return profile;
  },

  updateMe: async (dto) => {
    const profileId = await UserRepository.findProfileIdByUserId(dto.userId)
    return await UserRepository.updateUserAndProfile(dto, profileId);
  },
  verifyCode: async (data: VerifyCodeDTO) => {
    const { email, code } = data;

    // const user = await UserRepository.findByEmail(email)
    // if (!user) throw new NotFoundError("User")
    // const record = await PRISMA_CLIENT.user_app_emailverification.findFirst({
    //   where: {
    //     userId: user.id,
    //     code,
    //   },
    // });

    // if (!record) {
    //   throw new Error("Invalid code");
    // }

    // if (record.expires_at < new Date()) {
    //   throw new Error("Code expired");
    // }

  return "VERIFIED";
}
};
