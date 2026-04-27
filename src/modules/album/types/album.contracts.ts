import { Request, Response } from "express"
import { addImageDTO, Album, AlbumInfo, UpdateAlbum } from "./album.types"

export interface AlbumController {
    create:(req:Request<object, object, AlbumInfo >, res:Response) => void // 1
    update:(req:Request<object, object, UpdateAlbum>, res:Response) => void // 1
    getInfo: (req:Request<object, AlbumInfo, number>, res:Response<AlbumInfo>) => void // 1
    getAlbums: (req:Request<object, Album[], number>) => void // number here is a userId 2
    addImage: (req:Request<object, object, addImageDTO >, res:Response) => void // 2
    deleteAlbum: (req: Request<object, object, number >, res:Response) => void // 2
    deleteImage:(req: Request<object, object, number>, res:Response) => void // number here is a relation model id
    // the image remains, only relation model object is deleted // 3
}

export interface AlbumService {
    creaate: (createAlbum: AlbumInfo) => Promise<any>
    update: (UpdateAlbum: UpdateAlbum ) => Promise<any>
    getInfo: (id: number) => Promise<AlbumInfo>
    addImage: (addImageDTO: addImageDTO)=> Promise<any>
    getAlbums: (userId: number) => Promise<Album[]>
    deleteImage: (id:number) => Promise<any>
    deleteAlbum: (id:number) => Promise<Album[]>
}

export interface AlbumRepository {
    create: (createAlbum: AlbumInfo) => Promise<any>
    update: (UpdateAlbum: UpdateAlbum ) => Promise<any>
    getInfo: (id: number) => Promise<AlbumInfo>
    addImage: (addImageDTO: addImageDTO)=> Promise<any>
    getAlbums: (userId: number) => Promise<Album[]>
    deleteImage: (id:number) => Promise<any>
    deleteAlbum: (id:number) => Promise<any>        
}


