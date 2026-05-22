import { Prisma } from "@prisma/client";

export type Post = Prisma.PostGetPayload<{}>;

export type PostCredentials = {
  title: string;
  topic?: string;
  content: string;
  links?: string[];
};

export type AddPostImageDTO = {
  image: string;
  postId: number;
};
