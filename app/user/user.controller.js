import { prisma } from '../prisma.js';
import { UserFields } from '../utils/user.utils.js';
import asyncHandler from 'express-async-handler';

//@desc Get user profile
//@route GET /api/users/profile
//@access Private

export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: { id: req.user.id },
		select: UserFields
	});
	const countExerciseTimesCompleted = await prisma.exerciseLog.count({
		where: { userId: req.user.id, isCompleted: true }
	});
	const kgs = await prisma.exerciseTime.aggregate({
		where: {
			exerciseLog: {
				userId: req.user.id
			},
			isCompleted: true
		},
		_sum: {
			weight: true
		}
	});
	const workouts = await prisma.workoutLog.count({
		where: { userId: req.user.id, isCompleted: true }
	});
	res.json([
		{ label: 'Minutes', value: Math.ceil(countExerciseTimesCompleted * 2.3) },
		{ label: 'Workouts', value: workouts },
		{ label: 'Kgs', value: kgs._sum.weight || 0 }
	]);
});
