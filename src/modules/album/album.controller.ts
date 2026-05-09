import { NextFunction, Request, Response } from "express";
import { AlbumService } from "./album.service";
import { AlbumInfo, UpdateAlbum } from "./types/album.types";
import { AlbumControllerContracts } from "./types/album.contracts";
import fs from "fs";
import path from "path";
export const AlbumController: AlbumControllerContracts = {
  create: async (
    req: Request<object, any, AlbumInfo>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const album = await AlbumService.create(
        req.body,
        res.locals.userId,
      );

      res.status(201).json(album);
    } catch (error) {
      next(error);
    }
  },

  update: async (
    req: Request<{ id: string }, any, UpdateAlbum>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const album = await AlbumService.update(
        req.body,
        Number(req.params.id),
      );

      res.status(200).json(album);
    } catch (error) {
      next(error);
    }
  },

  getInfo: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const album = await AlbumService.getInfo(
        Number(req.params.id),
      );

      res.status(200).json(album);
    } catch (error) {
      next(error);
    }
  },
  getAlbums: async (req, res, next) => {
    try {
      const albums = await AlbumService.getAlbums(res.locals.userId);
      res.json(albums);
    } catch (e) {
      next(e);
    }
  },
  


  addImage: async (req, res, next) => {
    try {
      const { image, albumId } = req.body;

      const fileName = `img_${Date.now()}.jpg`;
      const filePath = path.join("uploads", fileName);

      const buffer = Buffer.from(image, "base64");

      fs.writeFileSync(filePath, buffer);

      const result = await AlbumService.addImage({
        image: fileName,
        albumId,
      });

      res.json(result);
    } catch (e) {
      next(e);
    }
},
  
  deleteAlbum: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
  
      const result = await AlbumService.deleteAlbum(
        id,
        res.locals.userId
      );
  
      res.json(result);
    } catch (e) {
      next(e);
    }
  },
};
