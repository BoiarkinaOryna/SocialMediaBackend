import { Router } from "express";
import { validateMiddleware } from "../../middlewares";
import { postSchema } from "./post.schema";
import { PostController } from "./post.controller";

export const PostRouter = Router();

PostRouter.post("/", validateMiddleware(postSchema), PostController.create);
PostRouter.get("/", PostController.getAll);
PostRouter.get("/my", PostController.getMy);
PostRouter.delete("/my", PostController.delete);
PostRouter.post("/image", PostController.addImage);
