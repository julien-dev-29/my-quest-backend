import prisma from '../../prisma/client.ts'
import { NextFunction, Request, Response } from 'express'
import { User } from '../../generated/prisma/index'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import passport from "passport";


export default {
    authGet: (req: Request, res: Response) => {
        res.json({ title: 'Login' })
    },

    login: (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local',
            { session: false },
            (err: Error, user: User, info: { message?: string } | undefined) => {
                if (err) next(err)
                if (!user) return res.status(401).json({
                    error: info?.message || "Connection failed"
                })
                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email
                    },
                    process.env.JWT_SECRET || 'cats' as string,
                    {
                        expiresIn: '1h'
                    }
                )
                res.json({
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }, token: token
                })
            }
        )(req, res, next)
    },

    logout: (req: Request, res: Response) => {
        req.logout((err) => {
            if (err) {
                return res.status(400).json({
                    error: err.message
                });
            }
            res.json({ message: "Logged out" });
        });
    },

    registerGet: (req: Request, res: Response) => {
        res.render('register', { title: 'Register' })
    },

    registerPost: async (req: Request, res: Response) => {
        try {
            console.log(req.body);

            const { username, email, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10)
            await prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    password: hashedPassword
                }
            })
            res.json({
                message: "User created"
            })
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : 'An error occurred'
            })
        }
    }
}