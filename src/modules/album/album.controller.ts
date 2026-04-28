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
};
