import { AuthenticatedSocket, SocketController } from "../../../socket/socket.types";
import { ChatWithChatParticipants, JoinChatPayload, LeaveChatPayload } from "./chat.types";


export type JoinChatCallback = (
	response: { status: "ok" } | { status: "error"; message?: string },
) => void;

export interface ChatClientEventsContract {
	joinChat: (data: JoinChatPayload, ack?: JoinChatCallback) => void;
	leaveChat: (data: LeaveChatPayload) => void;
}
export interface ChatSocketControllerContract extends SocketController {
	joinChat: (
		socket: AuthenticatedSocket,
		data: JoinChatPayload,
		ack?: JoinChatCallback,
	) => void;
	leaveChat: (socket: AuthenticatedSocket, data: LeaveChatPayload) => void;
}
export interface ChatServiceContract {
	isChatParticipant: (chatId: number, userId: number) => Promise<boolean>;
	getChatParticipants: (chatId: number) => Promise<ChatWithChatParticipants>;
}
export interface ChatRepositoryContract {
	getChatParticipants: (
		chatId: number,
	) => Promise<ChatWithChatParticipants>;
}