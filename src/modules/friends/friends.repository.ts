import { PRISMA_CLIENT } from "../../config/client";
import { NotFoundError } from "../../errors";
import { FriendsRepositoryContract } from "./types/friends.contracts";

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
          username: user?.username,
        };
    })
    console.log("requests", requests)
    return requests
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
    let profiles = await PRISMA_CLIENT.profile.findMany({
      where: {
        NOT: {id: profileId}
      }
    });
    console.log("profiles in recommendations", profiles)
    profiles = await Promise.all(
      profiles.map(async (profile) => {
        
        const user = await PRISMA_CLIENT.user.findUnique({
          where: {
            id: profile.userId,
          },
          select: {
            username: true,
          },
        });

        return {
          ...profile,
          username: user?.username,
        };
      })
    );
    return profiles



    // return await PRISMA_CLIENT.profile.findMany({
    //   where: {
    //     id: {
    //       in: friendIds,
    //     },
    //   },
    // });
  },

  async removeFriend(profileId, friendProfileId) {
    await PRISMA_CLIENT.friendsRequest.deleteMany({
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
