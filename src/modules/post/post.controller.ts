import { BadRequestError } from "../../errors";
import { ForbiddenError } from "../../errors/app.errors";
import { PostService } from "./post.service";
import { PostControllerContracts } from "./types/post.contracts";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { uploadDir } from "../../config/path";

export const PostController: PostControllerContracts = {
  create: async function (req, res, next) {
    try {
      const userId = res.locals.userId;

      console.log("create post data:", userId, req.body);

      const post = await PostService.create(userId, req.body);

      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  },
  getAll: async function (req, res, next) {
    try {
      const takeRaw = req.query.take;
      const pageRaw = req.query.page;

      const take = takeRaw !== undefined ? Number(takeRaw) : 15;
      const page = pageRaw !== undefined ? Number(pageRaw) : 1;
      if (take && isNaN(+take)) {
        throw new BadRequestError();
      }
      if (page && isNaN(+page)) {
        throw new BadRequestError();
      }
      const posts = await PostService.getAll(take && +take, page && +page);
      res.json(posts);
    } catch (error) {
      next(error);
    }
  },
  getMy: async function (req, res, next) {
    try {
      const takeRaw = req.query.take;
      const pageRaw = req.query.page;

      const take = takeRaw !== undefined ? Number(takeRaw) : 15;
      const page = pageRaw !== undefined ? Number(pageRaw) : 1;

      if (take && isNaN(+take)) {
        throw new BadRequestError();
      }
      if (page && isNaN(+page)) {
        throw new BadRequestError();
      }
      const userId = res.locals.userId;
      const posts = await PostService.getMy(
        userId,
        take && +take,
        page && +page,
      );
      res.json(posts);
    } catch (error) {
      next(error);
    }
  },
  delete: async function (req, res, next) {
    try {
      const userId = res.locals.userId;
      const currentUserID = req.body.userId;
      if (userId === currentUserID) {
        await PostService.delete(req.body.postId);
        res.status(204).json();
      } else {
        throw new ForbiddenError("Can't delete another user's post");
      }
    } catch (error) {
      next(error);
    }
  },
  addImage: async function (req, res, next) {
    try {
      const { image, postId } = req.body;

      const userId = res.locals.userId;

      const userFolder = path.join(uploadDir, `user_${userId}`);

      fs.mkdirSync(userFolder, { recursive: true });

      const fileName = `img_${Date.now()}.jpg`;

      const filePath = path.join(userFolder, fileName);

      const buffer = Buffer.from(image, "base64");

      await sharp(buffer).jpeg({ quality: 80 }).toFile(filePath);

      const result = await PostService.addImage({
        original_image: `user_${userId}/${fileName}`,
        compressed_image: `user_${userId}/${fileName}`,
        postId,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
