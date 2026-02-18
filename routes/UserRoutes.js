import e from 'express';
import authorize from '../middleware/authorization.js';
import { createuser, getAllUsers, login } from '../controller/Usercontroller.js';
const router = e.Router();

router.post('/',createuser)
router.post('/login',login)
router.get('/allusers', getAllUsers)

export default router;