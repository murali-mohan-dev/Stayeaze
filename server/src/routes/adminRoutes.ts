import { Router } from 'express';
import {
  getDashboardStats,
  createHotel,
  updateHotel,
  deleteHotel,
  createRoomCategory,
  updateRoomCategory,
  deleteRoomCategory,
  getAllBookings,
  updateBookingStatus,
  getAllCustomers,
  getAllPayments,
  getAllReviews,
  deleteReview,
  getAllServiceRequests,
} from '../controllers/adminController.js';
import {
  getAllCouponsAdmin,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus,
} from '../controllers/couponController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Apply auth + requireAdmin to all routes in admin
router.use(authenticateToken, requireAdmin);

router.get('/stats', getDashboardStats);

// Hotels
router.post('/hotels', createHotel);
router.put('/hotels/:id', updateHotel);
router.delete('/hotels/:id', deleteHotel);

// Room Categories
router.post('/room-categories', createRoomCategory);
router.put('/room-categories/:id', updateRoomCategory);
router.delete('/room-categories/:id', deleteRoomCategory);

// Bookings
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

// Customers
router.get('/customers', getAllCustomers);

// Payments
router.get('/payments', getAllPayments);

// Reviews
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

// Service Requests
router.get('/services', getAllServiceRequests);

// Promotional Coupons
router.get('/coupons', getAllCouponsAdmin);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.patch('/coupons/:id/toggle', toggleCouponStatus);

export default router;
