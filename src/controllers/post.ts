import { Request, Response } from "express";
import prisma from '../../prisma/client.ts'
const perPage = 10
export default {
    getAll: async (req: Request, res: Response) => {
        const page = Number(req.query.p) ?? 1
        const offset = (page - 1) * perPage
        try {
            const [posts, total] = await Promise.all([
                prisma.post.findMany({
                    skip: offset,
                    take: perPage,
                    orderBy: {
                        createdAt:  "desc"
                    }
                }),
                prisma.post.count()
            ])
            if (!posts) {
                res.status(404).json({
                    message: "No posts"
                })
            } else {
                res.json({
                    posts: posts,
                    total: Math.ceil(total / perPage),
                    page: page
                })
            }
        } catch (error) {
            if (error instanceof Error)
                res.status(400).json({
                    error: error.message
                })
        }

    },
    get: async (req: Request, res: Response) => {
        try {
            const id = req.params.postId
            const post = await prisma.post.findUnique({
                where: {
                    id: id
                },
                include: {
                    comment: true
                }
            })
            if (!post) {
                res.status(404).json({
                    message: "Post not found"
                })
            } else {
                res.json(post)
            }
        } catch (error) {
            if (error instanceof Error)
                res.status(400).json({
                    error: error.message
                })
        }
    },
    getComments: async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId
            const comments = await prisma.comment.findMany({
                where: {
                    postId: postId
                }
            })
            if (!comments) {
                res.json({
                    message: "No comments for this post"
                })
            } else {
                res.json(comments)
            }
        } catch (error) {
            if (error instanceof Error)
                res.status(400).json({
                    error: error.message
                })
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const { content, userId } = req.body
            const post = await prisma.post.create({
                data: {
                    content: content,
                    authorId: userId
                }
            })
            res.json({
                message: `Le post a été créé avec succès...`,
                post: post
            })
        } catch (error) {
            if (error instanceof Error)
                res.status(400).json({
                    error: error.message
                })
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId
            const { title, content, slug, userId } = req.body
            await prisma.post.update({
                data: {
                    content: content,
                    authorId: userId
                },
                where: {
                    id: postId
                }
            })
            res.json({
                message: `Le post ${title} a été modifié avec succès...`
            })
        } catch (error) {
            if (error instanceof Error)
                res.json({
                    error: error.message
                })
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId
            res.json({
                message: `Le post ${(await prisma.post.delete({
                    where: {
                        id: postId
                    }
                }))} a été supprimer avec succès`
            })
        } catch (error) {
            if (error instanceof Error)
                res.json({
                    error: error.message as string
                })
        }
    }
}