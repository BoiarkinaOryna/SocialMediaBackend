import { PRISMA_CLIENT } from "../../config/client";
import { NotFoundError } from "../../errors";
import type { FriendsRepositoryContract } from "./types/friends.contracts";

const shuffleArray = <T>(items: T[]): T[] => {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
};

export const FriendsRepository: FriendsRepositoryContract = {
  async getProfileById(profileId) {
    return await PRISMA_CLIENT.profile.findUnique({
      where: {
        id: profileId,
      },
    });
  },

  async sendRequest(fromProfileId, toProfileId) {
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

  async deleteRequestByIds(userId, senderId) {
    return await PRISMA_CLIENT.friendsRequest.deleteMany({
      where: {
        fromProfileId: senderId,
        toProfileId: userId
      },
    });
  },



  async acceptRequest(userId, senderId) {
    // const request = await this.getRequestById(requestId);
    await PRISMA_CLIENT.profile_app_profile_friends.create({
        data:{
          profileOneId: userId,
          profileTwoId: senderId

        }
    })
  },

  async getRequests(profileId) {
    const requests = await PRISMA_CLIENT.friendsRequest.findMany({
      where: {
        toProfileId: profileId,
      },
      include: {
        from_profile: true,
      },
    });

    return await Promise.all(
      requests.map(async (request) => {
        const user = await PRISMA_CLIENT.user.findUnique({
          where: {
            id: request.from_profile.userId,
          },
          select: {
            username: true,
          },
        });

        return {
          ...request,
          username: user?.username ?? null,
        };
      }),
    );
  },

  async getFriends(profileId: number) {
    const friendships = await PRISMA_CLIENT.profile_app_profile_friends.findMany({
      where: {
        OR: [
          { profileOneId: profileId },
          { profileTwoId: profileId },
        ],
      },
      include: {
        profileOne: true,
        profileTwo: true,
      },
    });

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const friend =
          friendship.profileOneId === profileId
            ? friendship.profileTwo
            : friendship.profileOne;

        const user = await PRISMA_CLIENT.user.findUnique({
          where: {
            id: friend.userId,
          },
          select: {
            username: true,
          },
        });

        return {
          ...friend,
          username: user?.username,
        };
      })
    );

    return friends;
  },

  async getRecommendations(profileId) {
    const [friendships, requests] = await Promise.all([
      PRISMA_CLIENT.profile_app_profile_friends.findMany({
        where: {
          OR: [{ profileOneId: profileId }, { profileTwoId: profileId }],
        },
      }),
      PRISMA_CLIENT.friendsRequest.findMany({
        where: {
          OR: [{ fromProfileId: profileId }, { toProfileId: profileId }],
        },
      }),
    ]);

    const excludedProfileIds = new Set<number>([profileId]);

    friendships.forEach((friendship) => {
      const friendId =
        friendship.profileOneId === profileId
          ? friendship.profileTwoId
          : friendship.profileOneId;

      excludedProfileIds.add(friendId);
    });

    requests.forEach((request) => {
      const requestedProfileId =
        request.fromProfileId === profileId
          ? request.toProfileId
          : request.fromProfileId;

      excludedProfileIds.add(requestedProfileId);
    });

    const profiles = await PRISMA_CLIENT.profile.findMany({
      where: {
        id: {
          notIn: [...excludedProfileIds],
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return shuffleArray(profiles).map(({ user, ...profile }) => ({
      ...profile,
      username: user.username ?? null,
    }));
  },

  async removeFriend(profileId, friendProfileId) {
    const deletedFriendships = await PRISMA_CLIENT.profile_app_profile_friends.deleteMany({
      where: {
        OR: [
          {
            profileOneId: profileId,
            profileTwoId: friendProfileId,
          },
          {
            profileOneId: friendProfileId,
            profileTwoId: profileId,
          },
        ],
      },
    });

    if (deletedFriendships.count === 0) {
      throw new NotFoundError("Friendship");
    }

    return deletedFriendships;
  },
};
