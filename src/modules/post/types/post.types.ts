import { Prisma } from "@prisma/client"

export type Post = Prisma.PostGetPayload<{}>

export type PostCredentials = {
    title: string,
    topic?: string,
<<<<<<< HEAD
    content: string,
    links?: string[]
=======
    content: string,    
    url?: string
>>>>>>> 0ab5b5f1cd12eea2354b5ab12d3483da1ec2a21b
}