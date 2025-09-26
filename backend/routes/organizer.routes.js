import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorize.middleware.js';
import { registerAsOrganizer, getOrganizerDetails, createEvent, getEventsByOrganizer} from '../controller/organizer.controller.js';
import { upload } from '../middleware/multer.middleware.js';

router.post('/register', authenticateToken, authorizeRoles(['attendee']), upload.single('Kycdoc'), registerAsOrganizer);
router.get('/get-details', authenticateToken, authorizeRoles(['organizer']), getOrganizerDetails);
router.post('/create-event', authenticateToken, authorizeRoles(['organizer']), upload.fields([{name : 'poster', maxCount : 1}, {name : 'image', maxCount : 3}, {name : 'video', maxCount : 1}]), createEvent);
router.get('/get-events', authenticateToken, authorizeRoles(['organizer']), getEventsByOrganizer);

export default router;