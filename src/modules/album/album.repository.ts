import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { PRISMA_CLIENT } from "../../config/client";
import { InternalServerError, NotFoundError } from "../../errors";
import { PrismaErrorCodes } from "../../types/error-codes";
import { AlbumRepositoryContract } from "./types/album.contracts";
import { addImageDTO, AlbumInfo, UpdateAlbum } from "./types/album.types";

export const AlbumRepository: AlbumRepositoryContract = {
  async create(data, profileId) {
    try {
      await PRISMA_CLIENT.album.create({
        data: {
          name: data.name,
          theme: data.theme,
          year: data.year,
          profileId,
        },
      });
    } catch (error) {
      throw handlePrismaError(error, "Album");
    }
  },

  async update(data, id) {
    try {
      await PRISMA_CLIENT.album.update({
        where: { id },
        data: {
          name: data.theme,
          theme: data.theme,
          year: data.year,
        },
      });
    } catch (error) {
      throw handlePrismaError(error, "Album");
    }
  },
  async getInfo(id) {
    try {
      return await PRISMA_CLIENT.album.findUnique({
        where: { id },
      })
    } catch (error) {
      throw handlePrismaError(error, "Album");
    }
  },

  async getById(id: number) {
    try {
      return await PRISMA_CLIENT.album.findUnique({
        where: { id },
      });
    } catch (error) {
      throw handlePrismaError(error, "Album");
    }
  },
  getAlbums: async (profileId: number) => {
    try{ 
      const albums = PRISMA_CLIENT.album.findMany({
        where: { profileId },
        include: {
          images: true,
        },
      });
      return albums
    } catch (error){
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
  
  addImage: async (data: addImageDTO) => {
    try{ 
      PRISMA_CLIENT.albumImage.create({
        data: {
          image: data.image,
          albumId: data.albumId,
        },
      });
    } catch (error){
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
      throw new InternalServerError();
    }
  },
  
  deleteAlbum: async (id: number) => {
    try{ 
      PRISMA_CLIENT.album.delete({
        where: { id },
      });
    } catch (error){
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorCodes.NOT_EXIST:
            return
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
};

function handlePrismaError(error: any, entityName: string) {
  console.log("handlePrismaError:", error)
  throw new NotFoundError(entityName)
}
