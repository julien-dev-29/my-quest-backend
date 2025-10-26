import { Request, Response } from "express";
import prisma from '../../prisma/client.ts'

export default {
    getAll: async () => { },
    get: async () => { },
    create: async (req: Request, res: Response) => {
        try {
            const { userId, postId, content, parentId } = req.body
            const newComment = await prisma.comment.create({
                data: {
                    postId: postId,
                    content: content,
                    userId: userId,
                    parentId: parentId
                },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    },
                    likes: true,
                }

            })
            res.status(201).json(newComment)
        } catch (error) {
            if (error instanceof Error)
                res.status(400).json({
                    error: error.message
                })
        }
    },
    update: async () => { },
    delete: async () => { }
}