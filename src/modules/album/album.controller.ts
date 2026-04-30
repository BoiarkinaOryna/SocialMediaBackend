import { NextFunction, Request, Response } from "express";
import { AlbumService } from "./album.service";
import { AlbumInfo, UpdateAlbum } from "./types/album.types";
import { AlbumControllerContracts } from "./types/album.contracts";
export const AlbumController: AlbumControllerContracts = {
  create: async (
    req: Request<object, any, AlbumInfo>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const album = await AlbumService.create({
        ...req.body,
        userId: res.locals.userId,
      });

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
      const album = await AlbumService.update({
        id: Number(req.params.id),
        ...req.body,
      });

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
      const album = await AlbumService.getInfo({
        id: Number(req.params.id),
      });

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
      const result = await AlbumService.addImage(req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },
  
  deleteAlbum: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
  
      await AlbumService.deleteAlbum(
        id,
        res.locals.userId
      );
  
      res.status(204);
    } catch (e) {
      next(e);
    }
  },
};
