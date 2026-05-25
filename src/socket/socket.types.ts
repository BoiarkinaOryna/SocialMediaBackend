import type {
	DefaultEventsMap,
	Socket,
	Server as SocketIOServer,
} from "socket.io";
import { UserClientEvents } from "../modules/user/types/user.contracts";
import { ChatClientEventsContract } from "../modules/chats/types/chat.contracts";

export type AppServerEvents = DefaultEventsMap;
export interface AppClientEvents extends ChatClientEventsContract, UserClientEvents {}

export interface SocketData {
	userId: number;
}

export type AuthenticatedSocket = Socket<
	AppClientEvents,
	AppServerEvents,
	object,
	SocketData
>;

export type ServerSocket = SocketIOServer<
	AppClientEvents,
	AppServerEvents,
	object,
	SocketData
>;

export interface SocketController {
	registerHandlers: (
		socket: AuthenticatedSocket,
		ioServer: ServerSocket,
	) => void;
}
