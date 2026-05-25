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
      return profile;
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
  async findById(id: number) {
    try {
      const user = await PRISMA_CLIENT.user.findUnique({
        where: { id },
        omit: {
          password: true,
        },
        include:{
          profile: {
            select: {
              pseudonym: true,
              birth_date: true,
              signature: true,
              avatar: true
            }
          }
        }
      });
      if (!user) {
        throw new NotFoundError("User");
      }
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        pseudonym: user?.profile?.pseudonym,
        birth_date: user?.profile?.birth_date,
        signature: user?.profile?.signature,
        avatar: user?.profile?.avatar

      };
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
    await PRISMA_CLIENT.user.update({
      where: {
        id: data.userId
      },
      data: {
        username: data.username
      }
    })

    return await PRISMA_CLIENT.profile.create({
      data: {
        userId: data.userId,
        pseudonym: data.pseudonym,
      },
    });
  },

  async updateUserAndProfile(data, profileId) {
    try{
      try {
        await PRISMA_CLIENT.profile.update({
          where: {id: profileId},
          data: {
            // firstName: data.name,
            // lastName: data.surname,
            avatar: data.avatar,
            birth_date: data.birthDate
          }
        })
      } catch(error){
        if (error instanceof PrismaClientKnownRequestError) {
          switch (error.code) {
            case PrismaErrorCodes.NOT_EXIST:
              throw new NotFoundError("Profile");
            default:
              throw new InternalServerError();
          }
        }
        if (error instanceof Error) {
          throw new InternalServerError(error.message);
        }
        throw new InternalServerError();
      }
      return await PRISMA_CLIENT.user.update({
        where: { id: data.userId },
        data: {
          email: data.email,
          username: data.username,
        }
      });
    } catch (error){
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
  async findProfileIdByUserId(userId) {
    try{
      const profile = await PRISMA_CLIENT.profile.findFirst({
        where: {userId}
      })
      if (profile){
        return profile.id
      } else{
        throw new NotFoundError("Profile")
      }
    } catch (error){
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError();
    }
  },
  async createAvatarAlbum(profileId) {
    try {
      await PRISMA_CLIENT.album.create({
        data:{
          profileId,
          name: "Аватарки",
          theme: "Мої фото",
          year: 0,
          
        }
      })
    }catch(error){
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError();
    }
  }
};
