import { BadRequestError } from "../../errors"
import { PostService } from "./post.service"
import { PostControllerContracts } from "./types/post.contracts"


export const PostController: PostControllerContracts = {
    create: async function (req, res, next) {
        try {
            const userId = res.locals.userId
            console.log("create post data:", userId, req.body)
            await PostService.create(userId, req.body)
            res.status(201).json()
        } catch (error){
            next(error)
        }
    },
    getAll: async function (req, res, next) {
        try{
            const takeRaw = req.query.take
            const pageRaw = req.query.page

            const take = takeRaw !== undefined ? Number(takeRaw) : 15
            const page = pageRaw !== undefined ? Number(pageRaw) : 1
            if (take && isNaN(+take)){
                throw new BadRequestError
            }
            if (page && isNaN(+page)){
                throw new BadRequestError
            }
            const posts = await PostService.getAll(
                take && +take,
                page && +page
            )
            res.json(posts)
        } catch (error) {
            next(error)
        }
    },
    getMy: async function (req, res, next) {
        try {
            const takeRaw = req.query.take
            const pageRaw = req.query.page

            const take = takeRaw !== undefined ? Number(takeRaw) : 15
            const page = pageRaw !== undefined ? Number(pageRaw) : 1

            if (take && isNaN(+take)){
                throw new BadRequestError
            }
            if (page && isNaN(+page)){
                throw new BadRequestError
            }
            const userId = res.locals. userId
            const posts = await PostService.getMy(
                userId,
                take && +take,
                page && +page
            )
            res.json(posts)
        } catch (error){
            next(error)
        }
    },
    delete: async function (req, res, next) {
        try {
            const userId = res.locals.userId
            const currentUserID = req.body.userId
            if (userId === currentUserID){
                await PostService.delete(req.body.postId)
                res.status(204).json()
            } else {
                res.status(403).json("Can't delete another user's post")
            }
        } catch (error){
            next(error)
        }
    }
}