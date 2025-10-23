import { Router } from "express";
import commentController from "../controllers/comment.ts"
import passport from "passport";
const router = Router()

router.get('/', passport.authenticate("jwt", { session: false }), commentController.getAll)
router.get('/:commentId', commentController.get)
router.post('/', passport.authenticate("jwt", { session: false }), commentController.create)
router.put('/:commentId', passport.authenticate("jwt", { session: false }), commentController.update)
router.delete('/:commentId', passport.authenticate("jwt", { session: false }), commentController.delete)

export default router