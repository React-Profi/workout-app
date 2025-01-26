import express from 'express';

import { protect } from '../middleware/auth.middleware.js';
import { getUserProfile } from './user.controller.js';

export const router = express.Router();

router.route('/profile').get(protect, getUserProfile);
