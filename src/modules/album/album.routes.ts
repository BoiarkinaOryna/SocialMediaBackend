import { Router } from "express";
import { AlbumController } from "./album.controller";
import { authenticateMiddleware } from "../../middlewares";

export const AlbumRouter = Router();

AlbumRouter.post("/", authenticateMiddleware, AlbumController.create);
AlbumRouter.get("/", authenticateMiddleware, AlbumController.getAlbums)
AlbumRouter.patch("/:id", authenticateMiddleware, AlbumController.update);
AlbumRouter.get("/:id", AlbumController.getInfo);
AlbumRouter.post("/image", authenticateMiddleware, AlbumController.addImage);