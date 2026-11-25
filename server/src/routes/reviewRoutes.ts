import { Router } from 'express';
import { addReview, getHotelReviews } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, addReview);
router.get('/hotel/:hotelId', getHotelReviews);

export default router;
