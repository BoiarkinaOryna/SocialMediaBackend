import type { UserRepository as RepoContract } from "./types/user.contracts";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { CreateProfileDTO, CreateUserPayload, UpdateMeDTO, User } from "./types/user.types";
// import { PrismaErrorCodes } from "@app-types/error-codes";
// import { InternalServerError, NotFoundError } from "@errors/app.errors";
import { PRISMA_CLIENT } from "../../config/client";
import { PrismaErrorCodes } from "../../types/error-codes";
import { InternalServerError, NotFoundError } from "../../errors";

export const UserRepository: RepoContract = {
  async findByEmail(email) {
    try {
      const user = await PRISMA_CLIENT.user.findUnique({
        where: { email },
        omit: { password: true },
        include: { profile: true },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorCodes.NOT_EXIST:
            throw new NotFoundError("User");
          default:
            throw new InternalServerError();
        }
      }
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError();
    }
  },
  async findByUsername(username) {
    try {
      const profile = await PRISMA_CLIENT.profile.findUnique({
        where: { username },
        include: {
          user: {
            omit: { password: true },
            include: { profile: true },
          },
        },
      });
      return profile?.user ?? null;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorCodes.NOT_EXIST:
            throw new NotFoundError("User");
          default:
            throw new InternalServerError();
        }
      }
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError();
    }
  },
  async findByIdWithPassword(id) {
    try {
      const user = PRISMA_CLIENT.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorCodes.NOT_EXIST:
            throw new NotFoundError("User");
          default:
            throw new InternalServerError();
        }
      }
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError();
    }
  },
  async create(data: CreateUserPayload) {
  try {
    const user = await PRISMA_CLIENT.user.create({
      data: {
        email: data.email,
        password: data.password,
        profile: {
          // create: {
          //   username: data.username,
          //   firstName: data.name,
          //   lastName: data.surname,
          //   avatar: data.avatar,
          // }
        }
      },
      omit: { password: true },
      include: { profile: true },
    });
    return user;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case PrismaErrorCodes.NOT_EXIST:
          throw new NotFoundError("User");
        default:
          throw new InternalServerError();
      }
    }
    if (error instanceof Error) {
      throw new InternalServerError(error.message);
    }
    throw new InternalServerError();
  }
},
  findById: function (id: number): Promise<User | null> {
    try {
      const user = PRISMA_CLIENT.user.findUnique({
        where: { id },
        omit: {
          password: true,
        },
        include: { profile: true },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorCodes.NOT_EXIST:
            throw new NotFoundError("User");
          default:
            throw new InternalServerError();
        }
      }
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError();
    }
  },
  async createProfile(data: CreateProfileDTO) {
    return await PRISMA_CLIENT.profile.create({
      data: {
        username: data.username,
        pseudonym: data.pseudonym,
      },
    });
  },

  async updateUserAndProfile(data: UpdateMeDTO) {
    return await PRISMA_CLIENT.user.update({
      where: { id: data.userId },
      data: {
        email: data.email,
        profile: {
          update: {
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            avatar: data.avatar,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  },
};
