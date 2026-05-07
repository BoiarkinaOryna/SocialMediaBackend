import { NextFunction, Request, Response } from "express";
import { SendRequestDTO } from "./friends.types";

export interface FriendsControllerContracts {
  sendRequest: (
    req: Request<object, object, SendRequestDTO>,
    res: Response,
    next: NextFunction,
  ) => void;

  acceptRequest: (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => void;

  getRequests: (req: Request, res: Response, next: NextFunction) => void;

  getFriends: (req: Request, res: Response, next: NextFunction) => void;

  getRecommendations: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;

  removeFriend: (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => void;
}

export interface FriendsServiceContract {
  sendRequest: (userId: number, toProfileId: number) => Promise<any>;

  acceptRequest: (userId: number, requestId: number) => Promise<any>;

  getRequests: (userId: number) => Promise<any>;

  getFriends: (userId: number) => Promise<any>;

  getRecommendations: (userId: number) => Promise<any>;

  removeFriend: (userId: number, friendProfileId: number) => Promise<any>;
}

export interface FriendsRepositoryContract {
  getProfileByUserId: (userId: number) => Promise<any>;

  getProfileById: (profileId: number) => Promise<any>;

  sendRequest: (fromProfileId: number, toProfileId: number) => Promise<any>;

  getRequestById: (requestId: number) => Promise<any>;

  getRequests: (profileId: number) => Promise<any>;

  getFriends: (profileId: number) => Promise<any>;

  getRecommendations: (profileId: number) => Promise<any>;

  removeFriend: (profileId: number, friendProfileId: number) => Promise<any>;
}
