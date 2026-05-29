import { Prisma } from "@prisma/client";

export interface JoinChatPayload {
	chatId: number;
}
export interface LeaveChatPayload {
	chatId: number;
}
export interface SendMessagePayload {
	chatId: number;
	text?: string;
	images?: string[];
}

export type ChatWithChatParticipants = Prisma.ChatGetPayload<{
	include: {
		users: true
	};
}>;

export type MessageWithRelations = Prisma.MessageGetPayload<{
	include: {
		sender: {
			select: {
				id: true;
				username: true;
			};
		};
		images: true;
		readers: true;
	};
}>;
