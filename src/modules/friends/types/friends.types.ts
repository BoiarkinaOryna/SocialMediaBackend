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
