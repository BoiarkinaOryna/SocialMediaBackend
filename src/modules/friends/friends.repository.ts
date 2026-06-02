import { PRISMA_CLIENT } from "../../config/client";
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
    return await PRISMA_CLIENT.profile_app_profile.findUnique({
      where: {
        id: profileId,
      },
    });
  },

  async sendRequest(from_user_id, to_user_id) {
    try {
      const request = await PRISMA_CLIENT.user_app_friendship.create({
        data: {
          from_user_id,
          to_user_id,
          status: "pending",
          created_at: new Date()
        },
      });
      console.log("request sended", request)
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Friend request already exists");
      }
      throw error;
    }
  },

  async deleteRequestByIds(userId, senderId) {
    console.log("in delete friend", userId, senderId)
    return await PRISMA_CLIENT.user_app_friendship.deleteMany({
      where: {
        OR: [
          {
            from_user_id: senderId,
            to_user_id: userId
          },
          {
            from_user_id: userId,
            to_user_id: senderId
          }
        ]
      },
    });
  },



  async acceptRequest(userId, senderId) {
    // const request = await this.getRequestById(requestId);
    await PRISMA_CLIENT.user_app_friendship.updateMany({
      where:{
        from_user_id: senderId,
        to_user_id: userId,
      },
      data:{
        status: "accepted"
      }
    })
  },

  async getRequests(to_user_id) {
    const requests = await PRISMA_CLIENT.user_app_friendship.findMany({
      where: {
        to_user_id: to_user_id,
      }
    });
    console.log("requests", requests)
    return await Promise.all(
      requests.map(async (request) => {
        const user = await PRISMA_CLIENT.user_app_user.findUnique({
          where: {
            id: request.from_user_id,
          },
          select: {
            username: true,
            profile_app_profile: {
              select: {
                pseudonym: true
              }
            }
          },
        });
        console.log("reqest user", user)

        return {
          ...request,
          id: Number(request.id),
          from_user_id: Number(request.from_user_id),
          to_user_id: Number(request.to_user_id),
          username: user?.username ?? null,
          pseudonym: user?.profile_app_profile?.pseudonym
        };
      }),
    );
  },

  async getFriends(userId: number) {
    const friendships = await PRISMA_CLIENT.user_app_friendship.findMany({
      where: {
        OR: [
          { from_user_id: userId },
          { to_user_id: userId },
        ],
      },
      // include: {
      //   user_app_user_user_app_friendship_from_user_idTouser_app_user: true,
      //   user_app_user_user_app_friendship_to_user_idTouser_app_user: true,
      // },
    });

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const friendId =
          Number(friendship.from_user_id) === userId
            ? Number(friendship.to_user_id)
            : Number(friendship.from_user_id);

        const user = await PRISMA_CLIENT.user_app_user.findUnique({
          where: {
            id: friendId,
          },
          select: {
            id: true,
            username: true,
            profile_app_profile: {
              select: {
                pseudonym: true,
              },
            },
          },
        });

        // const profile = await PRISMA_CLIENT.profile_app_profile.findFirst({
        //   where: {
        //     user_id: friendId
        //   }
        // })
        const friend = {
          id: Number(user?.id),
          from_user_id: Number(friendship.from_user_id),
          username: user?.username,
          pseudonym :user?.profile_app_profile?.pseudonym,
        };
        return friend
      })
    );
    
    console.log("friends", friends)
    return friends;
  },

  async getRecommendations(userId) {
    const [friendships] = await Promise.all([
      PRISMA_CLIENT.user_app_friendship.findMany({
        where: {
          OR: [{ from_user_id: userId }, { to_user_id: userId }],
        },
      }),
    ]);

    const excludedUserIds = new Set<number>([userId]);

    friendships.forEach((friendship) => {
      const friendId =
        Number(friendship.from_user_id) === userId
          ? friendship.from_user_id
          : friendship.to_user_id;

      excludedUserIds.add(Number(friendId));
    });

    // const profiles = await PRISMA_CLIENT.profile.findMany({
    //   where: {
    //     id: {
    //       notIn: [...excludedUserIds],
    //     },
    //   },
    //   include: {
    //     user: {
    //       select: {
    //         username: true,
    //       },
    //     },
    //   },
    // });

    const users = await PRISMA_CLIENT.user_app_user.findMany({
      where: {
        id: {
          notIn: [...excludedUserIds],
        },
      },
      include: {
        profile_app_profile: {
          select: {
            avatar: true,
          },
        },
      },
    })
    const usersWithNumberId =users.map(user => ({
      ...user,
      id: Number(user.id),
    }))
    // console.log("usersWithNumberId", usersWithNumberId)

    return usersWithNumberId

    // return shuffleArray(users).map(({ user, ...profile }) => ({
    //   ...profile,
    //   username: user.username ?? null,
    // }));
  },

  // async removeFriend(profileId, friendProfileId) {
    // const deletedFriendships = await PRISMA_CLIENT.user_app_friendship.deleteMany({
    //   where: {
    //     OR: [
    //       {
    //         profileOneId: profileId,
    //         profileTwoId: friendProfileId,
    //       },
    //       {
    //         profileOneId: friendProfileId,
    //         profileTwoId: profileId,
    //       },
    //     ],
    //   },
    // });

    // if (deletedFriendships.count === 0) {
    //   throw new NotFoundError("Friendship");
    // }

    // return deletedFriendships;
  // },
};
