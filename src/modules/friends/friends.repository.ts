import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { PRISMA_CLIENT } from "../../config/client";
import { InternalServerError, NotFoundError } from "../../errors";
import { PrismaErrorCodes } from "../../types/error-codes";
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
        status: "pending"
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
  },

  getUserInfo: async function (userId) {
    try{
      const userWithBigInts = await PRISMA_CLIENT.user_app_user.findUnique({
        where: {
          id: userId
        },
        omit: {
          password: true,
          last_login: true,
          is_superuser: true,
          is_staff: true,
          is_active: true,
          date_joined: true,
          email: true
        },
        include: {
          profile_app_profile: {
            select: {
              avatar: true,
              profile_app_album: {
                select: {
                  name: true,
                  theme: true,
                  year: true,
                  profile_app_albumimage: true
                }
              }
            },
            
          },
          post_app_post: {
            include: {
              post_app_post_tags: true,
              post_app_postheart: true,
              post_app_postimage: true,
              post_app_postlike: true,
              post_app_postlink: true,
              post_app_postview: true
            }
          },
          user_app_friendship_user_app_friendship_to_user_idTouser_app_user: true
        }
      })
      const userInfo = convertIds(userWithBigInts)
      return userInfo
    }
    catch(error: any){
      console.log("error:", error)
        if (error instanceof PrismaClientKnownRequestError) {
          switch (error.code) {
            case PrismaErrorCodes.NOT_EXIST:
              throw new NotFoundError("User")
            default:
              throw new InternalServerError();
          }
        }
        if (error instanceof Error) {
          throw new InternalServerError(error.message);
        }
        throw new InternalServerError();
    }
  }

};

const bigintKeys = new Set(['id', 'user_id', 'post_id', "tag_id", "author_id", "year", "from_user_id", "to_user_id"]);

function convertIds<T>(obj: T): T {
  if (Array.isArray(obj)) {
    obj.forEach(convertIds);
    return obj;
  }

  if (obj !== null && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      if (bigintKeys.has(key) && typeof value === 'bigint') {
        (obj as Record<string, unknown>)[key] = Number(value);
      } else {
        convertIds(value);
      }
    }
  }

  return obj;
}