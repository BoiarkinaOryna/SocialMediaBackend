import { Prisma } from "@prisma/client";


// I need to add smth because commit didn't push
export type Album = Prisma.AlbumGetPayload<{}>;

export type AlbumInfo = {
  name: string;
  theme: string;
  year: number;
};

export type AlbumInfoWithId = {
  id: number;
  name: string;
  theme: string;
  year: number;
}

export type UpdateAlbum = Partial<AlbumInfo>;

export type addImageDTO = {
  image: string;
  albumId: number;
};
