import express, { type Express } from "express";
import cors from "cors";
import { env } from "../config/env";
import { router } from "./routes";
import { logMiddleware, errorMiddleware } from "../middlewares";
import { uploadDir } from "../config/path";
import { AlbumRouter } from "../modules/album/album.routes";
import { FriendsRouter } from "../modules/friends/friends.routes";

const app: Express = express();
app.use(cors({ origin: "" }));
app.use(logMiddleware);
app.use(express.json());

app.use(router);
app.use("/albums", AlbumRouter);
app.use("/friends", FriendsRouter);
app.use(errorMiddleware);
console.log(uploadDir);
app.listen(env.PORT, () => {
  console.log(`Server started on http://localhost:${env.PORT}`);
});
