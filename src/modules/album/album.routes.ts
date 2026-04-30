import { Router } from "express";
import { AlbumController } from "./album.controller";
import { authenticateMiddleware } from "../../middlewares";

export const AlbumRouter = Router();

AlbumRouter.post("/", AlbumController.create);
AlbumRouter.patch("/:id", AlbumController.update);
AlbumRouter.get("/:id", AlbumController.getInfo);
AlbumRouter.delete("/:id", AlbumController.deleteAlbum)
