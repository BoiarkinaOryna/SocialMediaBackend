import express, { type Express } from "express";
import cors from "cors";
import { env } from "../config/env";
import { router } from "./routes";
import { logMiddleware, errorMiddleware } from "../middlewares";
import { uploadDir } from "../config/path";

const app: Express = express();
app.use(cors({ origin: "" }));
app.use(logMiddleware);
app.use(express.json())

app.use(router);

app.use(errorMiddleware);
console.log(uploadDir);
app.listen(env.PORT, env.HOST, () => {
	console.log(`Server started on http://${env.HOST}:${env.PORT}`);
});
