import { prisma } from '../../prisma.js';
import asyncHandler from 'express-async-handler';

//@desc Update workout log completed
//@route  PATCH /api/workout/log/complete/:id
//@access Private

export const updateCompleteWorkoutLog = asyncHandler(async (req, res) => {
	const logId = +req.params.id;
	try {
		const workoutLog = await prisma.workoutLog.update({
			where: {
				id: logId
			},
			data: {
				isCompleted: false
			}
		});
		res.json(workoutLog);
	} catch (e) {
		console.log(e);
		res.status(404);
		throw new Error('Workout log not found!');
	}
});
