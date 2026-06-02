import type { UserRepository as RepoContract } from "./types/user.contracts";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { CreateUserPayload, UpdateMeDTO, User } from "./types/user.types";
import { PRISMA_CLIENT } from "../../config/client";
import { PrismaErrorCodes } from "../../types/error-codes";
import { InternalServerError, NotFoundError } from "../../errors";

export const UserRepository: RepoContract = {
  async findByEmail(email) {
    try {
      const user = await PRISMA_CLIENT.user_app_user.findUnique({
        where: { email },
        omit: { password: true },
      });
      return user;
    } catch (error) {
      console.log("error:", error)
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
      const profile = await PRISMA_CLIENT.user_app_user.findUnique({
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
      const user = await PRISMA_CLIENT.user_app_user.findUniqueOrThrow({
        where: { id },
      });
      return {
        ...user,
        // id: Number(user.id),
      }
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
      const user = await PRISMA_CLIENT.user_app_user.create({
        data: {
          email: data.email,
          password: data.password,
          first_name: "",
          last_name: "",
          is_superuser: false,
          is_staff: false,
          is_active: false,
          date_joined: new Date()
        },
        omit: { password: true },
      });
      return user;
    } catch (error) {
      console.log("login error", error)
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError();
    }
  },
  async findById(id: number) {
    try {
      const user = await PRISMA_CLIENT.user_app_user.findUnique({
        where: { id },
        omit: {
          password: true,
        },
        include:{
          profile_app_profile: {
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
        id: Number(user.id),
        email: user.email,
        username: user.username,
        pseudonym: user?.profile_app_profile?.pseudonym,
        birth_date: String(user?.profile_app_profile?.birth_date),
        signature: user?.profile_app_profile?.signature,
        avatar: user?.profile_app_profile?.avatar

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
    await PRISMA_CLIENT.user_app_user.update({
      where: {
        id: data.userId
      },
      data: {
        username: data.username
      }
    })

    return await PRISMA_CLIENT.profile_app_profile.create({
      data: {
        user_id: data.userId,
        pseudonym: data.pseudonym,
        is_text_signature: false,
        is_image_signature: false
      },
    });
  },

  async updateUserAndProfile(data, profileId) {
    try{
      try {
        await PRISMA_CLIENT.profile_app_profile.update({
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
      return await PRISMA_CLIENT.user_app_user.update({
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
      const profile = await PRISMA_CLIENT.profile_app_profile.findFirst({
        where: {user_id: userId}
      })
      if (profile){
        return Number(profile.id)
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
      await PRISMA_CLIENT.profile_app_album.create({
        data:{
          profile_id: profileId,
          name: "Аватарки",
          theme: "Мої фото",
          year: 0,
          is_shown: true,
          is_default: true,
          created_at: new Date()
          
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
