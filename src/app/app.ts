import express, { type Express } from "express";
import cors from "cors";
import { env } from "../config/env";
import { router } from "./routes";
import { logMiddleware, errorMiddleware } from "../middlewares";
import { uploadDir } from "../config/path";
import { AlbumRouter } from "../modules/album/album.routes";
import path from "path";

const app: Express = express();


app.use(express.json({ limit: "10mb" }));

app.use(cors({ origin: "" }));
app.use(logMiddleware);
app.use(router);

app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
console.log("use uploalds:", path.join(__dirname, "../../uploads"))
app.use("/albums", AlbumRouter);
app.use(errorMiddleware);
console.log(uploadDir);
app.listen(env.PORT, env.HOST, () => {
  console.log(`Server started on http://${env.HOST}:${env.PORT}`);
});
