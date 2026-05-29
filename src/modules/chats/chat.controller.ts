import type { NextFunction, Request, Response } from "express";
import { ChatService } from "./chat.service";
import { SendMessagePayload } from "./types/chat.types";

export const ChatController = {
	sendMessage: async function (
		req: Request<{ chatId: string }, object, Omit<SendMessagePayload, "chatId">>,
		res: Response,
		next: NextFunction,
	) {
		try {
			const chatId = Number(req.params.chatId);
			const userId = res.locals.userId;

			const message = await ChatService.sendMessage(chatId, userId, req.body);
			res.status(201).json(message);
		} catch (error) {
			next(error);
		}
	},
};
