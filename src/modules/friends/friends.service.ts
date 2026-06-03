import { BadRequestError, NotFoundError } from "../../errors";
import { FriendsRepository } from "./friends.repository";
import { FriendsServiceContract } from "./types/friends.contracts";

export const FriendsService: FriendsServiceContract = {
  sendRequest: async (userId: number, toUserId: number) => {
    if (userId === toUserId) {
      throw new BadRequestError("You cannot send request to yourself");
    }

    return await FriendsRepository.sendRequest(userId, toUserId);
  },

  acceptRequest: async (userId, senderId) => {
    // const currentProfileId = await UserRepository.findProfileIdByUserId(userId);

    // if (!currentProfileId) {
    //   throw new NotFoundError("Profile");
    // }

    // const request = await FriendsRepository.getRequestById(requestId);

    // if (!request) {
    //   throw new NotFoundError("Friend request");
    // }

    // if (request.toProfileId !== currentProfileId) {
    //   throw new BadRequestError("This request does not belong to current user");
    // }
    return await FriendsRepository.acceptRequest(userId, senderId);
  },

  rejectRequest: async (userId, senderId) => {
    return await FriendsRepository.deleteRequestByIds(userId, senderId);
  },

  getRequests: async (userId) => {
    // const currentProfileId = await UserRepository.findProfileIdByUserId(userId);

    // if (!currentProfileId) {
      // throw new NotFoundError("Profile");
    // }

    return await FriendsRepository.getRequests(userId);
  },

  getFriends: async (userId) => {
    // const currentProfileId = await UserRepository.findProfileIdByUserId(userId);

    // if (!currentProfileId) {
    //   throw new NotFoundError("Profile");
    // }

    return await FriendsRepository.getFriends(userId);
  },

  getRecommendations: async (userId) => {
    // const currentProfileId = await UserRepository.findProfileIdByUserId(userId);

    // if (!currentProfileId) {
    //   throw new NotFoundError("Profile");
    // }

    return await FriendsRepository.getRecommendations(userId);
  },

  getUserInfo: async (userId) => {
    return await FriendsRepository.getUserInfo(userId)
  },

  // removeFriend: async (userId, friendProfileId) => {
    // const currentProfileId = await UserRepository.findProfileIdByUserId(userId);

    // if (!currentProfileId) {
    //   throw new NotFoundError("Profile");
    // }

    // return await FriendsRepository.removeFriend(
    //   userId,
    //   friendProfileId,
    // );
  // },
};
