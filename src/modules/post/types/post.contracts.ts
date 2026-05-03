import type { NextFunction, Request, Response } from "express";
import { Post, PostCredentials } from "./post.types";


export interface PostControllerContracts {
    create: (
        req: Request<object, object, PostCredentials>,
        res: Response,
        next: NextFunction
    ) => void
    getAll: (
        req: Request<object, Post[], object, {take?: string, page?: string}>,
        res: Response<Post[]>,
        next: NextFunction
    ) => void
    getMy: (
        req: Request<object, Post[], object, {take?: string, page?: string}>,
        res: Response<Post[]>,
        next: NextFunction
    ) => void
    delete: (
        req: Request<object, object, {userId: number, postId: number}>,
        res: Response,
        next: NextFunction
    ) => void
}

export interface PostServiceContracts {
    create: (id: number, data: PostCredentials) => Promise<any>,
    getAll: (take?: number, page?: number) => Promise<Post[]>,
    getMy: (id: number, take?: number, page?: number) => Promise<Post[]>,
    delete: (id: number) => Promise<any>
}

export interface PostRepositoryContracts {
    create: (id: number, data: PostCredentials) => Promise<any>,
    getAll: (take?: number, page?: number) => Promise<Post[]>,
    getMy: (id: number, take?: number, page?: number) => Promise<Post[]>,
    delete: (id: number) => Promise<any>
}