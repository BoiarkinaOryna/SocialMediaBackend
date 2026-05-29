import { AuthenticatedSocket, SocketController } from "../../../socket/socket.types";
import { ChatWithChatParticipants, JoinChatPayload, LeaveChatPayload, MessageWithRelations, SendMessagePayload } from "./chat.types";


export type JoinChatCallback = (
	response: { status: "ok" } | { status: "error"; message?: string },
) => void;
export type SendMessageCallback = (
	response:
		| { status: "ok"; message: MessageWithRelations }
		| { status: "error"; message?: string },
) => void;

export interface ChatClientEventsContract {
	joinChat: (data: JoinChatPayload, ack?: JoinChatCallback) => void;
	leaveChat: (data: LeaveChatPayload) => void;
	sendMessage: (data: SendMessagePayload, ack?: SendMessageCallback) => void;
}
export interface ChatServerEventsContract {
	newMessage: (message: MessageWithRelations) => void;
}
export interface ChatSocketControllerContract extends SocketController {
	joinChat: (
		socket: AuthenticatedSocket,
		data: JoinChatPayload,
		ack?: JoinChatCallback,
	) => void;
	leaveChat: (socket: AuthenticatedSocket, data: LeaveChatPayload) => void;
	sendMessage: (
		socket: AuthenticatedSocket,
		data: SendMessagePayload,
		ack?: SendMessageCallback,
	) => void;
}
export interface ChatServiceContract {
	isChatParticipant: (chatId: number, userId: number) => Promise<boolean>;
	getChatParticipants: (chatId: number) => Promise<ChatWithChatParticipants>;
	sendMessage: (
		chatId: number,
		senderId: number,
		data: Omit<SendMessagePayload, "chatId">,
	) => Promise<MessageWithRelations>;
}
export interface ChatRepositoryContract {
	getChatParticipants: (
		chatId: number,
	) => Promise<ChatWithChatParticipants>;
	createMessage: (
		chatId: number,
		senderId: number,
		text: string,
		images: string[],
	) => Promise<MessageWithRelations>;
}
