import { Server } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { AuthenticatedSocket, ServerSocket } from "./socket.types";

export class SocketManagerIO {
	private ioServer: ServerSocket;
	constructor(httpServer: Server) {
		this.ioServer = new SocketIOServer(httpServer, {
			cors: {
				origin: "*",
			},
		});
	}
	initConnection(
		callback?: (
			socket: AuthenticatedSocket,
			ioServer: ServerSocket,
		) => void,
	) {
		console.log("trying to connect")
		this.ioServer.on("connection", (socket) => {
			console.log("Connected: ", socket.id);
			callback?.(socket, this.ioServer);

			socket.on("disconnect", () => {
				console.log("Disconncted: ", socket.id);
			});
		});
	}
	useMiddleware(
		middleware: (socket: Socket, next: (err?: Error) => void) => void,
	) {
		this.ioServer.use(middleware);
	}
}
