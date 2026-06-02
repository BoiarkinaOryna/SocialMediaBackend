import { BadRequestError } from "../../errors";
import { ForbiddenError } from "../../errors/app.errors";
import { ChatRepository } from "./chat.repository";
import { ChatServiceContract } from "./types/chat.contracts";

export const ChatService: ChatServiceContract = {
	isChatParticipant: async function (chatId, userId) {
		const chat = await this.getChatParticipants(chatId);
		return chat.chat_app_chat_users.some(
			(participant: any) => participant.userId === userId,
		);
	},
	getChatParticipants: async function (chatId) {
		return await ChatRepository.getChatParticipants(chatId);
	},
	sendMessage: async function (chatId, senderId, data) {
		const text = data.text?.trim() ?? "";
		const images = data.images ?? [];

		if (!Number.isInteger(chatId)) {
			throw new BadRequestError("Chat id is invalid");
		}

		if (!Array.isArray(images)) {
			throw new BadRequestError("Images must be an array");
		}

		if (!text && images.length === 0) {
			throw new BadRequestError("Message text or image is required");
		}

		const isChatParticipant = await this.isChatParticipant(chatId, senderId);
		if (!isChatParticipant) {
			throw new ForbiddenError("You are not a participant of this chat");
		}

		return await ChatRepository.createMessage(chatId, senderId, text, images);
	},
}