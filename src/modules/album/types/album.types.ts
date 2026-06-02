import { Prisma } from "@prisma/client";


export type Album = Prisma.profile_app_albumGetPayload<{}>;

export type AlbumInfo = {
  name: string;
  theme: string | null;
  year: number | null;
};

export type UpdateAlbum = Partial<AlbumInfo>;

export type addImageDTO = {
  image: string;
  albumId: number;
};
