import { Router } from 'express';
import {
  calculatePrice,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/calculate', calculatePrice);
router.post('/', authenticateToken, createBooking);
router.get('/my', authenticateToken, getMyBookings);
router.get('/:id', authenticateToken, getBookingById);
router.patch('/:id/cancel', authenticateToken, cancelBooking);

export default router;
