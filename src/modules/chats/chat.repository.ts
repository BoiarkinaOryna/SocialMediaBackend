import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { PRISMA_CLIENT } from "../../config/client";
import { NotFoundError, InternalServerError } from "../../errors";
import { PrismaErrorCodes } from "../../types/error-codes";
import { ChatRepositoryContract } from "./types/chat.contracts";

export const ChatRepository: ChatRepositoryContract = {
	async getChatParticipants(chatId) {
        try{
            return await PRISMA_CLIENT.chat.findUniqueOrThrow({
			where: {
				id: chatId,
			},
			include: {
				users: true,
			},
		});
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
			return await PRISMA_CLIENT.message.create({
				data: {
					chatId,
					senderId,
					text,
					readers: {
						create: {
							userId: senderId,
						},
					},
					images: images.length
						? {
								create: images.map((image) => ({ image })),
							}
						: undefined,
				},
				include: {
					sender: {
						select: {
							id: true,
							username: true,
						},
					},
					images: true,
					readers: true,
				},
			});
		} catch (error) {
			if (error instanceof Error) {
				throw new InternalServerError(error.message);
			}
			throw new InternalServerError();
		}
	},
};
