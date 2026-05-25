import { ChatRepository } from "./chat.repository";
import { ChatServiceContract } from "./types/chat.contracts";

export const ChatService: ChatServiceContract = {
	isChatParticipant: async function (chatId, userId) {
		const chat = await this.getChatParticipants(chatId);
		return chat.users.some(
			(participant) => participant.userId === userId,
		);
	},
	getChatParticipants: async function (chatId) {
		return await ChatRepository.getChatParticipants(chatId);
	}
}