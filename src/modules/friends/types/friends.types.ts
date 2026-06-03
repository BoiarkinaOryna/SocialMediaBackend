import { Prisma } from "@prisma/client";

export type FriendRequest =
  Prisma.user_app_friendshipGetPayload<{}>;

export type SendRequestDTO = {
  toProfileId: number;
};

export type AcceptRequestDTO = {
  requestId: number;
};

export type RemoveFriendDTO = {
  profileId: number;
};

export type UserInfo = Prisma.user_app_userGetPayload<{
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
}>