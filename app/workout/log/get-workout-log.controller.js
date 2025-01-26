import { prisma } from '../../prisma.js';
import { calculateMinute } from '../calculate-minute.js';
import asyncHandler from 'express-async-handler';

//@desc Get workoutLog
//@route GET /api/workout/log/:id
//@access Private

export const getWorkoutLog = asyncHandler(async (req, res) => {
	const workoutLog = await prisma.workoutLog.findUnique({
		where: {
			id: +req.params.id
		},
		include: {
			workout: {
				include: {
					exercises: true
				}
			},
			exerciseLogs: {
				orderBy: { id: 'asc' },
				include: {
					exercise: true
				}
			}
		}
	});

	if (!workoutLog) {
		res.status(404);
		throw new Error('exerciseLog  not found!');
	}

	res.json({
		...workoutLog,
		minute: calculateMinute(workoutLog.workout.exercises.length)
	});
});
