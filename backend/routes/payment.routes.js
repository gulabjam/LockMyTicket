import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorize.middleware.js';
import { createPayment, verifyPayment } from '../controller/payment.controller.js';

router.post('/initiate-payment', authenticateToken, authorizeRoles(['attendee']), createPayment);
router.post('/verify-payment', authenticateToken, authorizeRoles(['attendee']), verifyPayment);

export default router;