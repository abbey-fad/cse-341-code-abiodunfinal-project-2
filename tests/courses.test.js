const request = require('supertest');

jest.mock('../middleware/authenticate', () => ({
	isAuthenticated: (req, res, next) => next(),
}));

jest.mock('../controllers/courses', () => ({
	getAll: (req, res) => res.status(200).json([{ _id: '1', name: 'Mock Course' }]),
	getSingle: (req, res) => res.status(200).json({ _id: '1', name: 'Mock Course' }),
	createCourse: (req, res) => res.status(201).json({ message: 'Course created' }),
	updateCourse: (req, res) => res.status(200).json({ message: 'Course updated' }),
	deleteCourse: (req, res) => res.status(200).json({ message: 'Course deleted' }),
}));

const app = require('../server');

describe('Courses API', () => {
	test('GET all courses', async () => {
		const res = await request(app).get('/courses');
		expect(res.statusCode).toBe(200);
		expect(res.body[0]).toHaveProperty('name', 'Mock Course');
	});

	test('POST create course', async () => {
		const res = await request(app).post('/courses').send({ name: 'New Course' });
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('message', 'Course created');
	});
});
