import { getUserProfile } from './user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import express from 'express';

export const router = express.Router();

router.route('/profile').get(protect, getUserProfile);
