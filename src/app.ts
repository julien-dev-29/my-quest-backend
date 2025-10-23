import "dotenv/config"
import express from "express"
import authRouter from "./routes/auth"
import postRouter from './routes/post.ts'
import commentRouter from "./routes/comment.ts"
import cors from "cors"
import bodyParser from "body-parser"
import helmet from "helmet"
import session from "express-session"
import passport from "passport"
import prisma from "../prisma/client.ts"
const app = express()
const PORT = process.env.PORT

app.use(helmet())
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())


// Passport
import '../config/passport.js'

app.use(passport.initialize())

app.use("/api/posts", postRouter)
app.use("/api/comments", commentRouter)
app.use(authRouter)

app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`🚀 App 🚀 running on port: ${PORT}`);
})