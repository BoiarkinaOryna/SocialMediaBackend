import express, { type Express } from "express";
import cors from "cors";
import { env } from "../config/env";
import { router } from "./routes";
import { createServer } from "node:http";
import { logMiddleware, errorMiddleware } from "../middlewares";
import { uploadDir } from "../config/path";
import { SocketManagerIO } from "../socket";
import { authenticateSocketMiddleware } from "../middlewares/authenticate.middleware";
import { UserSocketController } from "../modules/user/user.socket.controller";
import { ChatSocketController } from "../modules/chats/chat.socket.controller";
import { shouldStartTunnel, startTunnel } from "../config/db.tunnel";

(BigInt as any).toJSON = function(){
	return this.toString()
}

const app: Express = express();
const httpServer = createServer(app);

const socketManager = new SocketManagerIO(httpServer);
socketManager.useMiddleware(authenticateSocketMiddleware);

socketManager.initConnection((socket, ioServer) => {
	ChatSocketController.registerHandlers(socket, ioServer);
	// MessageSocketController.registerHandlers(socket, ioServer);
	UserSocketController.registerHandlers(socket, ioServer);
});

app.use(express.json({ limit: "10mb" }));

app.use(cors({ origin: "" }));
app.use(logMiddleware);
app.use(router);
app.use(errorMiddleware);
// console.log(uploadDir);
async function bootstrap(){
	try{
		if (shouldStartTunnel()) {
			await startTunnel()
		}
		httpServer.listen(env.PORT, env.HOST, () => {
			console.log(`Server started on http://${env.HOST}:${env.PORT}`);
		});
	} catch(error){
		console.log(error)
	}
}

bootstrap()
