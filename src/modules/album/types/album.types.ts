import { Prisma } from "@prisma/client";

export type Album = Prisma.AlbumGetPayload<{}>;

export type AlbumInfo = {
  name: string;
  theme: string;
  year: number;
};

export type UpdateAlbum = Partial<AlbumInfo>;

export type addImageDTO = {
  image: string;
  albumId: number;
};
