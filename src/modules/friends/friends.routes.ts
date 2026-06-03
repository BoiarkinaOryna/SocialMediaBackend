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

FriendsRouter.delete(
  "/request/:id",
  authenticateMiddleware,
  FriendsController.rejectRequest,
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

FriendsRouter.get(
  "/:id",
  authenticateMiddleware,
  FriendsController.getFriendInfo
)

// FriendsRouter.delete(
//   "/friend/:id",
//   authenticateMiddleware,
//   FriendsController.removeFriend,
// );
