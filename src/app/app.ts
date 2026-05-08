import express, { type Express } from "express";
import cors from "cors";
import { env } from "../config/env";
import { router } from "./routes";
import { logMiddleware, errorMiddleware } from "../middlewares";
import { uploadDir } from "../config/path";

const app: Express = express();


app.use(express.json({ limit: "10mb" }));

app.use(cors({ origin: "" }));
app.use(logMiddleware);
app.use(router);
app.use(errorMiddleware);
console.log(uploadDir);
app.listen(env.PORT, () => {
  console.log(`Server started on http://localhost:${env.PORT}`);
});
