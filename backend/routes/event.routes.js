import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorize.middleware.js';
import { updateEvent, deleteEvent,fetchEventsByUser } from '../controller/event.controller.js';

router.patch('/update-event', authenticateToken, authorizeRoles(['organizer']), updateEvent);
router.delete('/delete-event', authenticateToken, authorizeRoles(['organizer']), deleteEvent);
router.get('/get-events-by-user', authenticateToken, authorizeRoles(['attendee']), fetchEventsByUser);

export default router;