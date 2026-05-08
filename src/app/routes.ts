import { Router } from "express";
import { UserRouter } from "../modules/user/user.routes";
import { AlbumRouter } from "../modules/album/album.routes";
import { authenticateMiddleware } from "../middlewares";
import { PostRouter } from "../modules/post/post.routes";
import { FriendsRouter } from "../modules/friends/friends.routes";

export const router = Router();

router.get("/health", (req, res) => {
	res.json({ status: "ok", timestamp: Date.now() });
});
router.use("/users", UserRouter);
router.use("/friends", FriendsRouter);
// router.use("/albums", authenticateMiddleware, AlbumRouter);
// router.use("/posts", authenticateMiddleware, PostRouter)