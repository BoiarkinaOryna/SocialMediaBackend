import { Prisma } from "@prisma/client"

export type Post = Prisma.PostGetPayload<{}>

export type PostCredentials = {
    title: string,
    topic?: string,
    content: string,    
    url?: string
}