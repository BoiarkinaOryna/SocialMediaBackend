import { PRISMA_CLIENT } from "../../config/client";
import { InternalServerError } from "../../errors";
import { PostRepositoryContracts } from "./types/post.contracts";


export const PostRepository: PostRepositoryContracts = {
    create: async function (id, data) {
        try {
            const post = await PRISMA_CLIENT.post.create({
                data: {
                    author: {
                        connect: { id }
                    },
                    title: data.title,
                    topic: data.topic,
                    content: data.content
                }
            })
            for (let link in data.links){
                await PRISMA_CLIENT.postLink.create({
                    data:{
                        postId: post.id,
                        url: link
                    }
                })

            }
        } catch (error){
            if (error instanceof Error) {
                throw new InternalServerError(error.message);
            }
            throw new InternalServerError();
        }
    },
    getAll: async function (take, page){
        try{
            const posts = await PRISMA_CLIENT.post.findMany({
               skip: take * (page - 1),
                    take,
                    include: {
                        author: {
                            include: {
                                profile: true
                            }
                        }
                    }
                })  
            return posts
        } catch (error){
            if (error instanceof Error) {
                throw new InternalServerError(error.message);
            }
            throw new InternalServerError();
        }
    },
    getMy: async function (id, take, page) {
        try{
            const posts = await PRISMA_CLIENT.post.findMany({
                where: { authorId: id },
                skip: (take - take * page),
                take,
                include: {
                        author: {
                            include: {
                                profile: true
                            }
                        }
                    }
            })
            console.log("my posts", posts)
            return posts
        } catch (error){
            if (error instanceof Error) {
                throw new InternalServerError(error.message);
            }
            throw new InternalServerError();
        }
    },
    delete: async function (id) {
        try{
            await PRISMA_CLIENT.post.delete({where: {id}})
        } catch (error){
            if (error instanceof Error) {
                throw new InternalServerError(error.message);
            }
            throw new InternalServerError();
        }
    }
}