import { prisma } from '../prisma.js';
import { calculateMinute } from './calculate-minute.js';
import asyncHandler from 'express-async-handler';

//@desc Get workout
//@route GET /api/users/workout/:id
//@access Private

export const getWorkout = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: {
			id: +req.params.id
		},
		//без include будет так {}
		//а с ним в этом обьекте будет массив с данными
		//можно указать конкретно какие поля нам нужны
		//обьект как мы делали раньше с UserFields
		include: {
			exercises: true
		}
	});

	//фейковое заполнение данных
	const minutes = calculateMinute(workout.exercises.length);

	res.json({ ...workout, minutes });
});

//@desc Get workouts
//@route GET /api/users/workouts
//@access Private

export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		orderBy: {
			//сортировка  от самого нового и до самого старого  будут выводиться
			createdAt: 'desc'
		},
		include: {
			exercises: true
		}
	});

	res.json(workouts);
});

//@desc Create new workout
//@route POST /api/users/workout
//@access Private

export const createNewWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body;

	const workout = await prisma.workout.create({
		data: {
			name,
			exercises: {
				connect: exerciseIds.map(id => ({ id: +id }))
			}
		}
	});
	if (!workout) {
		res.status(404);
		throw new Error('Workout not found!');
	}
	res.json(workout);
});

//@desc Delete workout
//@route DELETE /api/users/workout/:id
//@access Private

export const deleteWorkout = asyncHandler(async (req, res) => {
	try {
		const workout = await prisma.workout.delete({
			//+(плюс) перевод из строки в число
			where: {
				id: +req.params.id
			}
		});
		res.json({ message: 'Workout deleted!' });
	} catch (error) {
		res.status(404);
		throw new Error('Workout not found!');
	}
});

//@desc Update workout
//@route UPDATE /api/users/workout/:id
//@access Private

export const updateWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body;
	try {
		const workout = await prisma.workout.update({
			//+(плюс) перевод из строки в число
			where: {
				id: +req.params.id
			},
			data: {
				name,
				exercises: {
					set: exerciseIds.map(id => ({ id: +id }))
				}
			}
		});

		res.json(workout);
	} catch (error) {
		res.status(404);
		console.log(error);
		throw new Error('Workout not found!');
	}
});
