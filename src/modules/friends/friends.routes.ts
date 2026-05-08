import { Router } from "express";
import { authenticateMiddleware } from "../../middlewares";
import { FriendsController } from "./friends.controller";

export const FriendsRouter = Router();

FriendsRouter.post(
  "/request",
  authenticateMiddleware,
  FriendsController.sendRequest,
);

FriendsRouter.post(
  "/accept/:id",
  authenticateMiddleware,
  FriendsController.acceptRequest,
);

FriendsRouter.get(
  "/requests",
  authenticateMiddleware,
  FriendsController.getRequests,
);

FriendsRouter.get("/all", authenticateMiddleware, FriendsController.getFriends);

FriendsRouter.get(
  "/recommendations",
  authenticateMiddleware,
  FriendsController.getRecommendations,
);

FriendsRouter.delete(
  "/:id",
  authenticateMiddleware,
  FriendsController.removeFriend,
);
