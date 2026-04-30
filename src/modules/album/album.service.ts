import { AlbumRepository } from "./album.repository";
import { NotFoundError } from "../../errors";
import { addImageDTO, AlbumInfo, UpdateAlbum } from "./types/album.types";
///
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
  getAlbums: async (userId: number) => {
    return AlbumRepository.getAlbums(userId);
  },
  
  addImage: async (data: addImageDTO) => {
    return AlbumRepository.addImage(data);
  },
  
  deleteAlbum: async (id: number, userId: number) => {
    const album = await AlbumRepository.getById(id);
  
    if (!album || album.userId !== userId) {
      throw new NotFoundError("Album");
    }
  
    return AlbumRepository.deleteAlbum(id);
  },
};
