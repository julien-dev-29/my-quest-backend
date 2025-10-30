import { Request, Response } from "express";
import prisma from "../../prisma/client.ts"
export default {
    getAll: async (req: Request, res: Response) => {
        const profiles = await prisma.profile.findMany()
        res.json(profiles)
    },
    get: async (req: Request, res: Response) => {
        const { userId } = req.params
        const profile = await prisma.profile.findUnique({
            where: {
                userId: userId
            }
        })
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            })
        }
        res.json(profile)
    },
    create: async (req: Request, res: Response) => {
        const { username, avatarUrl, bio, userId } = req.body
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        const profile = await prisma.profile.create({
            data: {
                userId: userId,
                username: username,
                avatarUrl: avatarUrl,
                bio: bio
            }
        })
        res.status(201).json(profile)
    },
    update: () => { },
    delete: () => { }
}