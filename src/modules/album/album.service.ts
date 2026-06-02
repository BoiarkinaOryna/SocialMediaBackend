import { AlbumRepository } from "./album.repository";
import { NotFoundError } from "../../errors";
import { addImageDTO, AlbumInfo, UpdateAlbum } from "./types/album.types";
import { AlbumServiceContract } from "./types/album.contracts";
import { UserRepository } from "../user/user.repository";
import { ForbiddenError } from "../../errors/app.errors";
///
export const AlbumService: AlbumServiceContract = {
  create: async (data, userId) => {
    const profileId = await UserRepository.findProfileIdByUserId(userId)
    return await AlbumRepository.create(data, profileId);
  },

  update: async (data, id) => {
    const album = await AlbumRepository.getById(id);

    if (!album) {
      throw new NotFoundError("Album");
    }

    return await AlbumRepository.update(data, id);
  },

  getInfo: async (id) => {
    const album = await AlbumRepository.getById(id);

    if (!album) {
      throw new NotFoundError("Album");
    }

    return {
      id: album.id,
      name: album.name,
      theme: album.theme,
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
    const profileId = await UserRepository.findProfileIdByUserId(userId)
    const album = await AlbumRepository.getById(id);
  
    if (!album) throw new NotFoundError("Album")
    if (Number(album.profile_id) !== profileId) {
      throw new ForbiddenError("Can't delete another user's album")
    }
  
    return AlbumRepository.deleteAlbum(id);
  },
};
