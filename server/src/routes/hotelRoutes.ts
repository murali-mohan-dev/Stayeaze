import { Router } from 'express';
import { getHotels, getHotelById, getPopularDestinations } from '../controllers/hotelController.js';

const router = Router();

router.get('/', getHotels);
router.get('/destinations', getPopularDestinations);
router.get('/:id', getHotelById);

export default router;
