import { NextFunction, Request, Response } from "express";
import { SendRequestDTO, UserInfo } from "./friends.types";

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

  rejectRequest: (
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

  getFriendInfo: (
    req: Request<{id: string}, UserInfo>,
    res: Response<UserInfo>,
    next: NextFunction
  ) => void;


  // removeFriend: (
  //   req: Request<{ id: string }>,
  //   res: Response,
  //   next: NextFunction,
  // ) => void;
}

export interface FriendsServiceContract {
  sendRequest: (userId: number, toUsereId: number) => Promise<any>;

  acceptRequest: (userId: number, senderId: number) => Promise<any>;

  rejectRequest: (userId: number, senderId: number) => Promise<any>;

  getRequests: (userId: number) => Promise<any>;

  getFriends: (userId: number) => Promise<any>;

  getRecommendations: (userId: number) => Promise<any>;

  getUserInfo: (userId: number) => Promise<UserInfo>

  // removeFriend: (userId: number, friendProfileId: number) => Promise<any>;
}

export interface FriendsRepositoryContract {
  getProfileById: (profileId: number) => Promise<any>;

  sendRequest: (fromProfileId: number, toProfileId: number) => Promise<any>;

  deleteRequestByIds: (userId: number, senderId: number) => Promise<any>;
  
  acceptRequest: (userId: number, senderId: number) => Promise<any>;

  getRequests: (userId: number) => Promise<any>;

  getFriends: (userId: number) => Promise<any>;

  getRecommendations: (userId: number) => Promise<any>;

  getUserInfo: (userId: number) => Promise<any>

  // removeFriend: (profileId: number, friendProfileId: number) => Promise<any>;
}
