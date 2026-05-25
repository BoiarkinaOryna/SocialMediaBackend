import { AppError } from "../../errors";
import { ChatService } from "./chat.service";
import { ChatSocketControllerContract } from "./types/chat.contracts";

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
	registerHandlers: (socket) => {
		socket.on("joinChat", (data, ack) => {
			ChatSocketController.joinChat(socket, data, ack);
		});
		socket.on("leaveChat", (data) => {
			ChatSocketController.leaveChat(socket, data);
		});
	},
};
