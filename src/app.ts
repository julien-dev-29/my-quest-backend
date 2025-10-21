import express from "express"
import authRouter from "./routes/auth"
import cors from "cors"
import bodyParser from "body-parser"
import helmet from "helmet"
import session  from "express-session"
import passport from "passport"
import prisma from "../prisma/client.ts"
const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(authRouter)
app.use(
    session({
        secret: process.env.SESSION_SECRET || "cats",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 jour
        },
        store: new PrismaSessionStore(
            prisma as any, // Cast to 'any' to satisfy type requirement
            {
                checkPeriod: 2 * 60 * 1000,  // toutes les 2 min, supprime les sessions expirées
                dbRecordIdIsSessionId: true, // option pratique
                dbRecordIdFunction: undefined,
            }
        ),
    })
);

// Passport
import '../config/passport.js'
import { PrismaSessionStore } from "@quixo3/prisma-session-store"

app.use(passport.initialize())
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user
    next();
});
app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`🚀 App 🚀 running on port: ${PORT}`);
})