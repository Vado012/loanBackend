import e from 'express';
import authorize from '../middleware/Authorization.js';
import { createuser, getAllUsers, login, getProfile, logout, forgotPassword, resetPassword } from '../controller/Usercontroller.js';
const router = e.Router();

router.post('/',createuser)
router.post('/login',login)
router.post('/logout',logout)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)
router.get('/allusers', authorize(["admin"]), getAllUsers)
router.get('/profile', authorize(["admin", "user"]), getProfile)

export default router;