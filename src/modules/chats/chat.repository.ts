import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { PRISMA_CLIENT } from "../../config/client";
import { NotFoundError, InternalServerError } from "../../errors";
import { PrismaErrorCodes } from "../../types/error-codes";
import { ChatRepositoryContract } from "./types/chat.contracts";

export const ChatRepository: ChatRepositoryContract = {
	async getChatParticipants(chatId) {
        try{
            const chat = await PRISMA_CLIENT.chat_app_chat.findFirst({
				where: {
					id: chatId,
				},
				include: {
					user_app_user: true,
					chat_app_chat_users: true,
					// name: true,
					// is_group: true,
					// avatar: true,
				},
			});
			return {
				id: Number(chat?.id),
				name: chat?.name!,
				is_group: chat?.is_group!,
				avatar: chat?.avatar!,
				admin_id: chat?.admin_id!,
				user_app_user: chat?.user_app_user
					? {
						...chat.user_app_user,
						id: Number(chat.user_app_user.id),
					}! : null,
				chat_app_chat_users:
					chat?.chat_app_chat_users?.map((u) => ({
						id: Number(u.id),
						chat_id: Number(u.chat_id),
						user_id: Number(u.user_id),
					})) ?? [],
			};
			// return {
			// 	...chatWithParticipants,
			// 	user_app_user: {
			// 		...chatWithParticipants?.user_app_user,
			// 		id: Number(chatWithParticipants?.user_app_user?.id),
			// 	},
			// 	chat_app_chat_users:
			// 		chatWithParticipants?.chat_app_chat_users?.map((u) => ({
			// 			...u,
			// 			id: Number(u.id),
			// 			chat_id: Number(u.chat_id),
			// 			user_id: Number(u.user_id),
			// 		})) ?? [],
			// 	id: Number(chatWithParticipants?.id),
			// 	name: chatWithParticipants?.name!,
			// 	is_group: chatWithParticipants?.is_group!,
			// 	avatar: chatWithParticipants?.avatar!,
			// 	admin_id: chatWithParticipants?.admin_id!
			// }
        } catch(error){
            if (error instanceof PrismaClientKnownRequestError) {
                switch (error.code) {
                    case PrismaErrorCodes.NOT_EXIST:
                    throw new NotFoundError("Chat");
                    default:
                    throw new InternalServerError();
                }
            }
            if (error instanceof Error) {
            throw new InternalServerError(error.message);
            }
            throw new InternalServerError();
        }	
	},
	async createMessage(chatId, senderId, text, images) {
		try {
			return await PRISMA_CLIENT.chat_app_message.create({
				data: {
					chat_id: chatId,
					sender_id: senderId,
					text,
					created_at: new Date(),
					chat_app_message_readers: {
						create: {
							user_id: senderId,
						},
					},
					chat_app_messageimage: images.length
						? {
								create: images.map((image) => ({ image })),
							}
						: undefined,
				},
				// include: {
				// 	user_app_user: {
				// 		select: {
				// 			id: true,
				// 			username: true,
				// 		},
				// 	},
				// 	images: true,
				// 	readers: true,
				// },
			});
		} catch (error) {
			if (error instanceof Error) {
				throw new InternalServerError(error.message);
			}
			throw new InternalServerError();
		}
	},
};