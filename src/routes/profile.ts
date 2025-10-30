import { Router } from "express";
import profileController from "../controllers/profile.ts"
import passport from "passport";
const router = Router()

router.get('/', profileController.getAll)
router.get('/:userId', profileController.get)
router.post('/', profileController.create)
router.put('/:profileId', passport.authenticate("jwt", { session: false }), profileController.update)
router.delete('/:profileId', passport.authenticate("jwt", { session: false }), profileController.delete)

export default router