import { AlbumRepository } from "./album.repository";
import { NotFoundError } from "../../errors";
import { AlbumInfo, UpdateAlbum } from "./types/album.types";

export const AlbumService = {
  create: async (data: AlbumInfo & { userId: number }) => {
    return await AlbumRepository.create(data);
  },

  update: async (data: UpdateAlbum & { id: number }) => {
    const album = await AlbumRepository.getById(data.id);

    if (!album) {
      throw new NotFoundError("Album");
    }

    return await AlbumRepository.update(data);
  },

  getInfo: async (data: { id: number }) => {
    const album = await AlbumRepository.getById(data.id);

    if (!album) {
      throw new NotFoundError("Album");
    }

    return {
      title: album.title,
      topic: album.topics,
      year: album.year,
    };
  },
};
