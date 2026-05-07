import { BadRequestError, NotFoundError } from "../../errors";
import { FriendsRepository } from "./friends.repository";

export const FriendsService = {
  sendRequest: async (userId: number, toProfileId: number) => {
    const currentProfile = await FriendsRepository.getProfileByUserId(userId);

    if (!currentProfile) {
      throw new NotFoundError("Profile");
    }

    if (currentProfile.id === toProfileId) {
      throw new BadRequestError("You cannot send request to yourself");
    }

    return await FriendsRepository.sendRequest(currentProfile.id, toProfileId);
  },

  acceptRequest: async (userId: number, requestId: number) => {
    const currentProfile = await FriendsRepository.getProfileByUserId(userId);

    if (!currentProfile) {
      throw new NotFoundError("Profile");
    }

    const request = await FriendsRepository.getRequestById(requestId);

    if (!request) {
      throw new NotFoundError("Friend request");
    }

    if (request.toProfileId !== currentProfile.id) {
      throw new BadRequestError("This request does not belong to current user");
    }

    return await FriendsRepository.acceptRequest(requestId);
  },

  getRequests: async (userId: number) => {
    const currentProfile = await FriendsRepository.getProfileByUserId(userId);

    if (!currentProfile) {
      throw new NotFoundError("Profile");
    }

    return await FriendsRepository.getRequests(currentProfile.id);
  },

  getFriends: async (userId: number) => {
    const currentProfile = await FriendsRepository.getProfileByUserId(userId);

    if (!currentProfile) {
      throw new NotFoundError("Profile");
    }

    return await FriendsRepository.getFriends(currentProfile.id);
  },

  getRecommendations: async (userId: number) => {
    const currentProfile = await FriendsRepository.getProfileByUserId(userId);

    if (!currentProfile) {
      throw new NotFoundError("Profile");
    }

    return await FriendsRepository.getRecommendations(currentProfile.id);
  },

  removeFriend: async (userId: number, friendProfileId: number) => {
    const currentProfile = await FriendsRepository.getProfileByUserId(userId);

    if (!currentProfile) {
      throw new NotFoundError("Profile");
    }

    return await FriendsRepository.removeFriend(
      currentProfile.id,
      friendProfileId,
    );
  },
};
