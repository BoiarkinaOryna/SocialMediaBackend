import { Prisma } from "@prisma/client";


export type Album = Prisma.AlbumGetPayload<{}>

export type AlbumInfo = {
    title: string;
    topic: string;
    year: number;
}

export type UpdateAlbum = Partial<AlbumInfo>

export type addImageDTO = {
    image: string,
    albumId: number
}
