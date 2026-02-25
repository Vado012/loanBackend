import e from 'express';
import { applyLoan, deleteLoan, getAllLoan, getUserLoans, updateLoan } from '../controller/loanController.js';
import authorize from '../middleware/Authorization.js';
const router = e.Router();

router.post('/',authorize(["admin","user"]), applyLoan)
router.get('/all',authorize(["admin"]), getAllLoan)
router.get('/myloans',authorize(["user"]), getUserLoans)
router.delete('/:id',authorize(["admin", "user"]), deleteLoan)
router.put('/:id', updateLoan)

export default router;
