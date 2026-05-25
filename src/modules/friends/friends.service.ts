import { BadRequestError, NotFoundError } from "../../errors";
import { UserRepository } from "../user/user.repository";
import { FriendsRepository } from "./friends.repository";
import { FriendsServiceContract } from "./types/friends.contracts";

export const FriendsService: FriendsServiceContract = {
  sendRequest: async (userId: number, toUserId: number) => {
    const currentProfileId = await UserRepository.findProfileIdByUserId(userId);
    const toProfileId = await UserRepository.findProfileIdByUserId(toUserId);
    if (!currentProfileId || !toProfileId) {
      throw new NotFoundError("Profile");
    }
    console.log("currentProfileId", currentProfileId, "toProfileId", toProfileId)
    if (currentProfileId === toProfileId) {
      throw new BadRequestError("You cannot send request to yourself");
    }

    return await FriendsRepository.sendRequest(currentProfileId, toProfileId);
  },

  acceptRequest: async (userId, senderId) => {
    const currentProfileId = await UserRepository.findProfileIdByUserId(userId);

    if (!currentProfileId) {
      throw new NotFoundError("Profile");
    }

    // const request = await FriendsRepository.getRequestById(requestId);

    // if (!request) {
    //   throw new NotFoundError("Friend request");
    // }

    // if (request.toProfileId !== currentProfileId) {
    //   throw new BadRequestError("This request does not belong to current user");
    // }
    await FriendsRepository.deleteRequestByIds(currentProfileId, senderId);
    await FriendsRepository.acceptRequest(currentProfileId, senderId);
  },

  rejectRequest: async (userId, senderId) => {
    const currentProfileId = await UserRepository.findProfileIdByUserId(userId);

    if (!currentProfileId) {
      throw new NotFoundError("Profile");
    }

    return await FriendsRepository.deleteRequestByIds(currentProfileId, senderId);
  },

  getRequests: async (userId) => {
    const currentProfileId = await UserRepository.findProfileIdByUserId(userId);

    if (!currentProfileId) {
      throw new NotFoundError("Profile");
    }

    return await FriendsRepository.getRequests(currentProfileId);
  },

  getFriends: async (userId) => {
    const currentProfileId = await UserRepository.findProfileIdByUserId(userId);

    if (!currentProfileId) {
      throw new NotFoundError("Profile");
    }

    return await FriendsRepository.getFriends(currentProfileId);
  },

  getRecommendations: async (userId) => {
    const currentProfileId = await UserRepository.findProfileIdByUserId(userId);

    if (!currentProfileId) {
      throw new NotFoundError("Profile");
    }

    return await FriendsRepository.getRecommendations(currentProfileId);
  },

  removeFriend: async (userId, friendProfileId) => {
    const currentProfileId = await UserRepository.findProfileIdByUserId(userId);

    if (!currentProfileId) {
      throw new NotFoundError("Profile");
    }

    return await FriendsRepository.removeFriend(
      currentProfileId,
      friendProfileId,
    );
  },
};
