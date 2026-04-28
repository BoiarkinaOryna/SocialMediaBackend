import { PRISMA_CLIENT } from "../../config/client";
import { AlbumInfo, UpdateAlbum } from "./types/album.types";

export const AlbumRepository = {
  async create(data: AlbumInfo & { userId: number }) {
    try {
      return await PRISMA_CLIENT.album.create({
        data: {
          title: data.title,
          topics: data.topic,
          year: data.year,
          userId: data.userId,
        },
      });
    } catch (error) {
      throw handlePrismaError(error, "Album");
    }
  },

  async update(data: UpdateAlbum & { id: number }) {
    try {
      return await PRISMA_CLIENT.album.update({
        where: { id: data.id },
        data: {
          title: data.title,
          topics: data.topic,
          year: data.year,
        },
      });
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
};

function handlePrismaError(error: any, entityName: string) {
  throw new Error("Function not implemented.");
}
