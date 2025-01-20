import { prisma } from '../../prisma.js';
import asyncHandler from 'express-async-handler';
import { addPrevValues } from './add-prev-values.util.js';

//@desc Get exerciseLog
//@route GET /api/exercise/log/:id
//@access Private

export const getExerciseLog = asyncHandler(async (req, res) => {
	const exerciseLog = await prisma.exerciseLog.findUnique({
		where: {
			id: +req.params.id
		},
		include: {
			exercise: true,
			times: {
				orderBy: { id: 'desc' }
			}
		}
	});

	if (!exerciseLog) {
		res.status(404);
		throw new Error('exerciseLog  not found!');
	}

	const prevExerciseLog = await prisma.exerciseLog.findFirst({
		where: {
			exerciseId: exerciseLog.exerciseId,
			userId: req.user.id,
			isCompleted: true
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			times: true
		}
	});
	const newTimes = addPrevValues(exerciseLog, prevExerciseLog);
	res.json({ ...exerciseLog, times: newTimes });
});
