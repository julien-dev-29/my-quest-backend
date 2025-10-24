import { Router } from "express";
import replyController from "../controllers/reply.ts"
import passport from "passport";
const router = Router()

router.get('/', passport.authenticate("jwt", { session: false }), replyController.getAll)
router.get('/:replyId', passport.authenticate("jwt", { session: false }), replyController.get)
router.post('/', passport.authenticate("jwt", { session: false }), replyController.create)
router.put('/:replyId', passport.authenticate("jwt", { session: false }), replyController.update)
router.delete('/:replyId', passport.authenticate("jwt", { session: false }), replyController.delete)

export default router