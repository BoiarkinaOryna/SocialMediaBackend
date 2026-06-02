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

type ChatWithChatParticipants = Prisma.chat_app_chatGetPayload<{
	include: {
		user_app_user: true,
		chat_app_chat_users: true
	};
}>;

export type ChatWithChatParticipantsDto =
	Omit<
		ChatWithChatParticipants,
		"id" | "chat_id" | "user_id" | "user_app_user" | "chat_app_chat_users"
	> & {
		id: number;

		// user_app_user: Omit<
		// 	ChatWithChatParticipants["user_app_user"],
		// 	"id"
		// > & {
		// 	id: number;
		// };
		user_app_user:
			| (Omit<
					ChatWithChatParticipants["user_app_user"],
					"id"
			  > & {
					id: number;
			  })
			| null;

		chat_app_chat_users: {
			id: number;
			chat_id: number;
			user_id: number;
		}[];
	};

export type MessageWithRelations = Prisma.chat_app_messageGetPayload<{}>;