import { Router } from 'express';
import {
  createServiceRequest,
  getMyServiceRequests,
  updateServiceStatus,
} from '../controllers/serviceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, createServiceRequest);
router.get('/my', authenticateToken, getMyServiceRequests);
router.patch('/:id/status', authenticateToken, updateServiceStatus);

export default router;
