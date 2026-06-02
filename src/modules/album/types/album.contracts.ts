import { NextFunction, Request, Response } from "express";
import { addImageDTO, Album, AlbumInfo, UpdateAlbum } from "./album.types";

export interface AlbumControllerContracts {
  create: (
    req: Request<object, object, AlbumInfo>,
    res: Response,
    next: NextFunction,
  ) => void;

  update: (
    req: Request<{ id: string }, object, UpdateAlbum>,
    res: Response,
    next: NextFunction,
  ) => void;

  getInfo: (
    req: Request<{ id: string }, object, object>,
    res: Response,
    next: NextFunction,
  ) => void;
  getAlbums: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  
  addImage: (
    req: Request<object, object, addImageDTO>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  
  deleteAlbum: (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  // deleteImage:(req: Request<object, object, number>, res:Response) => void // number here is a relation model id
  // the image remains, only relation model object is deleted // 3
}

export interface AlbumServiceContract {
  create: (data: AlbumInfo, userId: number) => Promise<any>;
  update: (data: UpdateAlbum, id: number) => Promise<any>;
  getInfo: (id: number) => Promise<AlbumInfo>;
  getAlbums: (userId: number) => Promise<Album[] | null>;
  addImage: (data: addImageDTO) => Promise<any>;
  deleteAlbum: (id: number, userId: number) => Promise<any>;
  // deleteAlbum: (id: number) => Promise<Album[]>;
}

export interface AlbumRepositoryContract {
  create: (createAlbum: AlbumInfo, profileId: number) => Promise<any>;
  getById: (id: number) => Promise<Album | null>
  update: (data: UpdateAlbum, id: number) => Promise<any>;
  getInfo: (id: number) => Promise<AlbumInfo | null>;
  getAlbums: (userId: number) => Promise<Album[] | null>;
  addImage: (data: addImageDTO) => Promise<any>;
  deleteAlbum: (id: number) => Promise<any>;
  // deleteAlbum: (id: number) => Promise<any>;
}
