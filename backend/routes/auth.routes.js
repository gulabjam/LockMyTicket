import express from 'express';
const router = express.Router();
import { signUp, login, fetchProfile } from '../controller/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

router.post('/signup', signUp);
router.post('/login', login);
router.get('/fetchProfile', authenticateToken, fetchProfile);

export default router;