import type { UserRepository as RepoContract } from "./types/user.contracts";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { CreateUserPayload, UpdateMeDTO, User } from "./types/user.types";
import { PRISMA_CLIENT } from "../../config/client";
import { PrismaErrorCodes } from "../../types/error-codes";
import { InternalServerError, NotFoundError } from "../../errors";

export const UserRepository: RepoContract = {
  async findByEmail(email) {
    try {
      const user = await PRISMA_CLIENT.user.findUnique({
        where: { email },
        omit: { password: true },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorCodes.NOT_EXIST:
            return null
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
      const profile = await PRISMA_CLIENT.user.findUnique({
        where: { username },
        omit: { password: true },
      });
      return profile ?? null;
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
        },
        omit: { password: true },
      });
      return user;
    } catch (error) {
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
  async createProfile(data) {
    return await PRISMA_CLIENT.user.update({
      where: {id: data.userId},
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
        username: data.username,
        firstName: data.name,
        lastName: data.surname,
        avatar: data.avatar,
        // birthDate: data.birthDate
      }
    });
  },
};
