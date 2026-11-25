import { Router } from 'express';
import { validateCoupon, getActiveCoupons } from '../controllers/couponController.js';

const router = Router();

router.post('/validate', validateCoupon);
router.get('/', getActiveCoupons);

export default router;
