import { Prisma } from "@prisma/client"

export type Post = Prisma.PostGetPayload<{}>

export type PostCredentials = {
    title: string,
    topic?: string,
    text?: string,
    url?: string
}