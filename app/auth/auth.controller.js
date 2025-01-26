import { prisma } from '../prisma.js';
import { UserFields } from '../utils/user.utils.js';
import { generateToken } from './generate-token.js';
import { faker } from '@faker-js/faker';
import { hash, verify } from 'argon2';
import asyncHandler from 'express-async-handler';

export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await prisma.user.findUnique({
		where: { email }
	});

	const isValidPassword = await verify(user.password, password);

	if (user && isValidPassword) {
		const token = generateToken(user.id);
		res.json({ user, token });
	} else {
		res.status(401);
		throw new Error('Email and password are not correct');
	}
	res.json(user);
});

export const registerUser = asyncHandler(async (req, res) => {
	//что бы не писать req.body.email
	const { email, password } = req.body;

	const isHaveUser = await prisma.user.findUnique({
		where: {
			email
		}
	});

	if (isHaveUser) {
		res.status(400);
		throw new Error('User already exists');
	}

	const user = await prisma.user.create({
		data: {
			email,
			password: await hash(password),
			name: faker.person.fullName()
		},
		select: UserFields
	});

	//Токен нужен для того что бы человек при запросе к серверу
	// приклеплял токен к хедеру авторизации
	//и тем самым наш сервер будет понимать что это за человек
	const token = generateToken(user.id);
	res.json({ user, token });
});
