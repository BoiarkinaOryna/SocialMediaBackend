import { PRISMA_CLIENT } from "../../config/client";
import { NotFoundError } from "../../errors";

export const FriendsRepository = {
  async getProfileByUserId(userId: number) {
    return await PRISMA_CLIENT.profile.findUnique({
      where: {
        userId,
      },
    });
  },

  async getProfileById(profileId: number) {
    return await PRISMA_CLIENT.profile.findUnique({
      where: {
        id: profileId,
      },
    });
  },

  async sendRequest(fromProfileId: number, toProfileId: number) {
    try {
      const targetProfile = await this.getProfileById(toProfileId);

      if (!targetProfile) {
        throw new NotFoundError("Profile");
      }

      return await PRISMA_CLIENT.friendsRequest.create({
        data: {
          fromProfileId,
          toProfileId,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Friend request already exists");
      }

      throw error;
    }
  },

  async getRequestById(requestId: number) {
    return await PRISMA_CLIENT.friendsRequest.findUnique({
      where: {
        id: requestId,
      },
    });
  },

  async acceptRequest(requestId: number) {
    const request = await this.getRequestById(requestId);

    if (!request) {
      throw new Error("Request not found");
    }

    return request;
  },

  async getRequests(profileId: number) {
    return await PRISMA_CLIENT.friendsRequest.findMany({
      where: {
        toProfileId: profileId,
      },
      include: {
        from_profile: true,
      },
    });
  },

  async getFriends(profileId: number) {
    return await PRISMA_CLIENT.friendsRequest.findMany({
      where: {
        OR: [
          {
            fromProfileId: profileId,
          },
          {
            toProfileId: profileId,
          },
        ],
      },
      include: {
        from_profile: true,
        to_profile: true,
      },
    });
  },

  async getRecommendations(profileId: number) {
    const friends = await PRISMA_CLIENT.friendsRequest.findMany({
      where: {
        OR: [
          {
            fromProfileId: profileId,
          },
          {
            toProfileId: profileId,
          },
        ],
      },
    });

    const friendIds = friends.map((friend) =>
      friend.fromProfileId === profileId
        ? friend.toProfileId
        : friend.fromProfileId,
    );

    return await PRISMA_CLIENT.profile.findMany({
      where: {
        id: {
          in: friendIds,
        },
      },
    });
  },

  async removeFriend(profileId: number, friendProfileId: number) {
    return await PRISMA_CLIENT.friendsRequest.deleteMany({
      where: {
        OR: [
          {
            fromProfileId: profileId,
            toProfileId: friendProfileId,
          },
          {
            fromProfileId: friendProfileId,
            toProfileId: profileId,
          },
        ],
      },
    });
  },
};
