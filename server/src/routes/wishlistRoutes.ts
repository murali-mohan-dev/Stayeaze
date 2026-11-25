import { Router } from 'express';
import { toggleWishlist, getMyWishlist } from '../controllers/wishlistController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/toggle', authenticateToken, toggleWishlist);
router.get('/my', authenticateToken, getMyWishlist);

export default router;
