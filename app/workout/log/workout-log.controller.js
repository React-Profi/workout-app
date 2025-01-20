import { prisma } from '../../prisma.js';
import asyncHandler from 'express-async-handler';

//@desc Create new workout log
//@route POST /api/workouts/log/:idd
//@access Private

export const createNewWorkoutLog = asyncHandler(async (req, res) => {
	const workoutId = req.params.id;
	const workout = await prisma.workout.findUnique({
		where: {
			id: +workoutId
		},
		include: { exercises: true }
	});
	if (!workout) {
		res.status(404);
		throw new Error('Workout not found!');
	}
	try {
		const workoutLog = await prisma.workoutLog.create({
			data: {
				user: {
					connect: {
						id: req.user.id // Устанавливаем связь с пользователем
					}
				},
				workout: {
					connect: { id: +workoutId } //Связываем с массивом упражнений
				},
				exerciseLogs: {
					create: workout.exercises.map(exercise => ({
						user: {
							connect: {
								id: req.user.id
							}
						},
						exercise: {
							connect: {
								id: exercise.id
							}
						},
						times: {
							create: Array.from({ length: exercise.times }, () => ({
								weight: 0,
								repeat: 0
							}))
						}
					}))
				}
			},
			include: {
				exerciseLogs: {
					include: {
						times: true
					}
				}
			}
		});
		res.json(workoutLog);
	} catch (e) {
		console.log(e);
		throw new Error('Workout log not found!');
	}
});
