import e from 'express';
import authorize from '../middleware/Authorization.js';
import { createuser, getAllUsers, login, getProfile } from '../controller/Usercontroller.js';
const router = e.Router();

router.post('/',createuser)
router.post('/login',login)
router.get('/allusers', getAllUsers)
router.get('/profile', authorize(["admin", "user"]), getProfile)

export default router;