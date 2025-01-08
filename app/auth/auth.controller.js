import { prisma } from '../prisma.js';
import asyncHandler from 'express-async-handler';
import { faker } from '@faker-js/faker';
import { generateToken } from './generate-token.js';
import { hash } from 'argon2';
import { UserFields } from '../utils/user.utils.js';
export const authUser = asyncHandler(async (req, res) => {
	const users = await prisma.user.findMany({ where: { password1: 'cat' } });
	res.json({ message: 'Hi', users: users });
	//res.json({ message: 'Hi' });
});

export const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body; //что бы не писать req.body.email

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
