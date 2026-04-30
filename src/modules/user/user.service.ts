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
    const user = await UserRepository.findByEmail(credentials.email);
    if (!user) {
      throw new NotFoundError("User");
    }
    // if (!user.isVerified) {
    //   throw new AuthenticationError("Email not verified");
    // }
    const userWithPassword = await UserRepository.findByIdWithPassword(user.id);
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
        id: userWithPassword.id,
      },
      env.SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );
    return { token };
  },
  register: async (credentials) => {
    const existingUserByEmail = await UserRepository.findByEmail(
      credentials.email,
    );
    if (existingUserByEmail) {
      throw new ConflictError(`User with email ${credentials.email}`);
    }

    const hashedPassword = await hash(credentials.password, 10);

    const userToCreate: CreateUserPayload = {
      ...credentials,
      password: hashedPassword,
    };

    await UserRepository.create(userToCreate);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await PRISMA_CLIENT.verificationCode.create({
      data: {
        email: credentials.email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
      },
    });
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
    return await UserRepository.createProfile(dto);
  },

  updateMe: async (dto) => {
    return await UserRepository.updateUserAndProfile(dto);
  },
  verifyCode: async (data: VerifyCodeDTO) => {
  const { email, code } = data;

  const record = await PRISMA_CLIENT.verificationCode.findFirst({
    where: {
      email,
      code,
      isUsed: false,
    },
  });

  if (!record) {
    throw new Error("Invalid code");
  }

  if (record.expiresAt < new Date()) {
    throw new Error("Code expired");
  }

  await PRISMA_CLIENT.user.update({
    where: { email },
    data: { isVerified: true },
  });

  await PRISMA_CLIENT.verificationCode.update({
    where: { id: record.id },
    data: { isUsed: true },
  });

  return "VERIFIED";
}
};
