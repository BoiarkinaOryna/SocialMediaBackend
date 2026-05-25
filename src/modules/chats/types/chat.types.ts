import { Prisma } from "@prisma/client";

export interface JoinChatPayload {
	chatId: number;
}
export interface LeaveChatPayload {
	chatId: number;
}
export type CreateChatDto = {
	contactUserId: number;
	ownerId: number;
};

export type ChatWithChatParticipants = Prisma.ChatGetPayload<{
	include: {
		users: true
	};
}>;