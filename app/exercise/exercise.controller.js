import asyncHandler from 'express-async-handler';

import { prisma } from '../prisma.js';
import { UserFields } from '../utils/user.utils.js';

//@desc Create new exercise
//@route POST /api/exercise/exercise
//@access Private

export const createNewExercise = asyncHandler(async (req, res) => {
	const { name, times, iconPath } = req.body;

	const exercise = await prisma.exercise.create({
		data: {
			name,
			times,
			iconPath
		}
	});

	res.json(exercise);
});

//@desc Delete exercise
//@route DELETE /api/exercise/exercise/:id
//@access Private

export const deleteExercise = asyncHandler(async (req, res) => {
	try {
		const exercise = await prisma.exercise.delete({
			//+(плюс) перевод из строки в число
			where: {
				id: +req.params.id
			}
		});
		res.json({ message: 'Exercise deleted!' });
	} catch (error) {
		res.status(404);
		throw new Error('Exercise not found!');
	}
});

//@desc Update exercise
//@route UPDATE /api/exercise/exercise/:id
//@access Private

export const updateExercise = asyncHandler(async (req, res) => {
	const { name, times, iconPath } = req.body;
	try {
		const exercise = await prisma.exercise.update({
			//+(плюс) перевод из строки в число
			where: {
				id: +req.params.id
			},
			data: {
				name,
				times,
				iconPath
			}
		});

		res.json(exercise);
	} catch (error) {
		res.status(404);

		throw new Error('Exercise not found!');
	}
});

//@desc Get exercise
//@route GET /api/exercise/exercise
//@access Private

export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany({
		orderBy: {
			//сортировка  от самого нового и до самого старого  будут выводиться
			createdAt: 'desc'
		}
	});

	res.json(exercises);
});
