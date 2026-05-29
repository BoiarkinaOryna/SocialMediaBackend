import { Router } from "express";
import { ChatController } from "./chat.controller";

export const ChatRouter = Router();

ChatRouter.post("/:chatId/messages", ChatController.sendMessage);
