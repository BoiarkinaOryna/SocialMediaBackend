import { AppError } from "../../errors";
import { ChatService } from "./chat.service";
import { ChatSocketControllerContract, JoinChatCallback, SendMessageCallback } from "./types/chat.contracts";
import { JoinChatPayload, LeaveChatPayload, SendMessagePayload } from "./types/chat.types";

const CHAT_ROOM_PREFIX = "chat:";

export const ChatSocketController: ChatSocketControllerContract = {
	joinChat: async (socket, data, ack) => {
		try {
			const isChatParticipant = await ChatService.isChatParticipant(
				data.chatId,
				socket.data.userId,
			);
			if (isChatParticipant) {
				socket.join(CHAT_ROOM_PREFIX + data.chatId);
				if (ack) {
					ack({ status: "ok" });
				}
			} else {
				if (ack) {
					ack({
						status: "error",
						message: `User:${socket.data.userId} is not a chat participant of chat:${data.chatId}`,
					});
				}
			}
		} catch (error) {
			console.error(error);
			if (!ack) return;
			if (error instanceof AppError) {
				ack({
					status: "error",
					message: error.message,
				});
			}
		}
	},
	leaveChat: (socket, data) => {
		console.log("Socket left chat");
		socket.leave(CHAT_ROOM_PREFIX + data.chatId);
	},
	sendMessage: async (socket, data, ack) => {
		try {
			const message = await ChatService.sendMessage(
				data.chatId,
				socket.data.userId,
				data,
			);

			socket.to(CHAT_ROOM_PREFIX + data.chatId).emit("newMessage", message);
			socket.emit("newMessage", message);

			if (ack) {
				ack({ status: "ok", message });
			}
		} catch (error) {
			console.error(error);
			if (!ack) return;
			if (error instanceof AppError) {
				ack({
					status: "error",
					message: error.message,
				});
				return;
			}
			ack({
				status: "error",
				message: "Message was not sent",
			});
		}
	},
	registerHandlers: (socket) => {
		socket.on("joinChat", (data: JoinChatPayload, ack?: JoinChatCallback) => {
			ChatSocketController.joinChat(socket, data, ack);
		});
		socket.on("leaveChat", (data: LeaveChatPayload) => {
			ChatSocketController.leaveChat(socket, data);
		});
		socket.on("sendMessage", (data: SendMessagePayload, ack?: SendMessageCallback) => {
			ChatSocketController.sendMessage(socket, data, ack);
		});
	},
};
