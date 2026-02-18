import e from 'express';
import { applyLoan, deleteLoan, getAllLoan, updateLoan } from '../controller/loanController.js';
import authorize from '../middleware/authorization.js';
const router = e.Router();

router.post('/',authorize(["admin","user"]), applyLoan )
router.get('/',authorize(["admin", "user"]), getAllLoan)
router.delete('/:id',authorize(["admin", "user"]), deleteLoan)
router.put('/:id',authorize(["admin", "user"]), updateLoan)

export default router;
