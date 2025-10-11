const request = require('supertest');
const express = require('express');

jest.mock('../middleware/authenticate', () => ({
	isAuthenticated: (req, res, next) => next(), 
}));

jest.mock('../controllers/users', () => ({
	getAll: (req, res) => res.status(200).json([{ _id: '1', name: 'Mock User' }]),
	getSingle: (req, res) => {
		if (req.params.id === '1') return res.status(200).json({ _id: '1', name: 'Mock User' });
		return res.status(404).json({ message: 'User not found' });
	},
	getProfile: (req, res) => res.status(401).json({ message: 'Unauthorized' }),
	createUser: (req, res) => res.status(201).json({ message: 'Created' }),
	updateUser: (req, res) => res.status(200).json({ message: 'Updated' }),
	deleteUser: (req, res) => res.status(200).json({ message: 'Deleted' }),
}));

const app = require('../server');

describe('Users API GET Endpoints', () => {
	test('returns all users', async () => {
		const res = await request(app).get('/users');
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body[0]).toHaveProperty('name', 'Mock User');
	});

	test('returns a single user by ID', async () => {
		const res = await request(app).get('/users/1');
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('name', 'Mock User');
	});

	test('returns 404 for non-existent user', async () => {
		const res = await request(app).get('/users/999');
		expect(res.statusCode).toBe(404);
		expect(res.body).toHaveProperty('message', 'User not found');
	});

	test('denies access to profile without authentication', async () => {
		const res = await request(app).get('/users/profile');
		expect(res.statusCode).toBe(401);
		expect(res.body).toHaveProperty('message', 'Unauthorized');
	});
});
