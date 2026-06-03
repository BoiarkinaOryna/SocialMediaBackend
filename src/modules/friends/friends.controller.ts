import { NextFunction, Request, Response } from "express";
import { FriendsControllerContracts } from "./types/friends.contracts";
import { FriendsService } from "./friends.service";
import { BadRequestError } from "../../errors";

export const FriendsController: FriendsControllerContracts = {
  sendRequest: async (req, res, next) => {
    try {
      console.log("from user", res.locals.userId, "to user", req.body.toProfileId,)
      const result = await FriendsService.sendRequest(
        res.locals.userId,
        req.body.toProfileId,
      );
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === "Friend request already exists") {
        res.status(409).json({
          status: "error",
          message: error.message,
        });
        return;
      }

      next(error);
    }
  },

  acceptRequest: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await FriendsService.acceptRequest(
        res.locals.userId,
        Number(req.params.id),
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  rejectRequest: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await FriendsService.rejectRequest(
        res.locals.userId,
        Number(req.params.id),
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  getRequests: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await FriendsService.getRequests(res.locals.userId);

      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  },

  getFriends: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const friends = await FriendsService.getFriends(res.locals.userId);

      res.status(200).json(friends);
    } catch (error) {
      next(error);
    }
  },

  getRecommendations: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recommendations = await FriendsService.getRecommendations(
        res.locals.userId,
      );

      res.status(200).json(recommendations);
    } catch (error) {
      next(error);
    }
  },

  getFriendInfo: async function (req, res, next) {
    try{
      const userId = Number(req.params.id)
      if (!userId){
        throw new BadRequestError("User id is required")
      }
      const userInfo = await FriendsService.getUserInfo(userId)
      return res.json(userInfo)
    }
    catch(error){
      next(error)
    }
  }

  // removeFriend: async (
  //   req: Request<{ id: string }>,
  //   res: Response,
  //   next: NextFunction,
  // ) => {
  //   try {
  //     await FriendsService.removeFriend(
  //       res.locals.userId,
  //       Number(req.params.id),
  //     );

  //     res.status(204).send();
  //   } catch (error) {
  //     next(error);
  //   }
  // },
};
