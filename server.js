import { router as authRouter } from './app/auth/auth.routers.js';
import { router as userRouter } from './app/user/user.routers.js';
import express from 'express';
import { router as exerciseRouter } from './app/exercise/exercise.routers.js';
import { router as workoutRouter } from './app/workout/workout.routers.js';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { prisma } from './app/prisma.js';
import { errorHandler, notFound } from './app/middleware/error.middleware.js';
import 'colors';
dotenv.config();

const app = express();
async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
	app.use(express.json());

	const __dirname = path.resolve();
	app.use('/uploads', express.static(path.join(__dirname, '/uploads/')));

	app.use('/api/auth', authRouter);

	app.use('/api/users', userRouter);
	app.use('/api/exercises', exerciseRouter);
	app.use('/api/workouts', workoutRouter);

	app.use(notFound);
	app.use(errorHandler);

	const PORT = process.env.PORT || 5000;
	app.listen(PORT, console.log(`Server start on port ${PORT}`.green.bold));
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
