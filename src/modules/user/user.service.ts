import { UserService as ServiceContract } from "./types/user.contracts";
import { UserRepository } from "./user.repository";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { env } from "../../config/env";
import { CreateUserPayload, RegisterDto, registrationCodesType } from "./types/user.types";
import { NotFoundError } from "../../errors";
import { AuthenticationError, ConflictError } from "../../errors/app.errors";

const RegistrationCodes: registrationCodesType[] = []

export const UserService: ServiceContract = {
  login: async (credentials) => {
    const user = await UserRepository.findByEmail(credentials.email);
    if (!user) {
      throw new NotFoundError("User");
    }
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
    // const existingUserByUsername = await UserRepository.findByUsername(
    //   credentials.username,
    // );
    // if (existingUserByUsername) {
    //   throw new ConflictError(`User with username ${credentials.username}`);
    // }
    const hashedPassword = await hash(credentials.password, 10);
    const userToCreate: CreateUserPayload = {
      ...credentials,
      password: hashedPassword,
    };
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: env.EMAIL,
            pass: env.EMAIL_PASSWORD,
        },
    })
    let code: string
    while (true){
        code = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0")

        let exists = false
        for (let passcode of RegistrationCodes){
            if (passcode.code === code){
                exists = true
                break
            }
        }
        
        if (!exists) {
            break
        }
    }
    const info = await transporter.sendMail({
        from: `"Drones for Everyone" <${env.EMAIL}>`,
        to: credentials.email,
        subject: "Here is your ",
        // text: `Go to the link below to reset your password: http://localhost:8001/user/change-password?user_code=${code}`, // Plain-text version of the message
        // html: `<p>Go to the link below to reset your password<br>http://localhost:8001/user/change-password?user_code=${code}</p>`, // HTML version of the message
    })
    RegistrationCodes.push({
      "code": code,
      "userEmail": credentials.email
    })

    console.log(RegistrationCodes)
    UserRepository.create(userToCreate);
    return "EMAIL_SENT"
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
  verifyCode: async () => {}
};
