import { prisma } from '../../prisma.js';
import asyncHandler from 'express-async-handler';

//@desc Update exercise time
//@route PUT /api/exercise/log/time/:id
//@access Private

export const updateExerciseLogTime = asyncHandler(async (req, res) => {
	const { weight, repeat, isCompleted } = req.body;
	try {
		const exerciseLogTime = await prisma.exerciseTime.update({
			where: {
				id: +req.params.id
			},
			data: {
				weight,
				repeat,
				isCompleted
			}
		});
		res.json(exerciseLogTime);
	} catch (e) {
		console.log(e);
		res.status(404);
		throw new Error('Exercise log time not found!');
	}
});

//@desc Update status of complete exercise log
//@route PATCH /api/exercise/log/complete/:id
//@access Private

export const completeExerciseLog = asyncHandler(async (req, res) => {
	const { isCompleted } = req.body;
	try {
		const exerciseLog = await prisma.exerciseLog.update({
			where: {
				id: +req.params.id
			},
			data: {
				isCompleted
			},
			include: { exercise: true, workoutLog: true }
		});
		res.json(exerciseLog);
	} catch (e) {
		console.log(e);
		res.status(404);
		throw new Error('Exercise log not found!');
	}
});
