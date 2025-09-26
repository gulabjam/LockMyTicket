import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorize.middleware.js';
import { getUserTickets } from '../controller/ticket.controller.js';

router.get('/my-tickets', authenticateToken, getUserTickets);

export default router;