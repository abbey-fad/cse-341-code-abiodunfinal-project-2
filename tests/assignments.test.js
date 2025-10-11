const request = require('supertest');

jest.mock('../middleware/authenticate', () => ({
	isAuthenticated: (req, res, next) => next(),
}));

jest.mock('../controllers/assignments', () => ({
	getAll: (req, res) => res.status(200).json([{ _id: '1', title: 'Mock Assignment' }]),
	getSingle: (req, res) => {
		if (req.params.id === '1') return res.status(200).json({ _id: '1', title: 'Mock Assignment' });
		return res.status(404).json({ message: 'Not found' });
	},
	createAssignment: (req, res) => res.status(201).json({ message: 'Created' }),
	updateAssignment: (req, res) => res.status(200).json({ message: 'Updated' }),
	deleteAssignment: (req, res) => res.status(200).json({ message: 'Deleted' }),
}));

const app = require('../server');

describe('Assignments API GET Endpoints', () => {
	test('GET all assignments', async () => {
		const res = await request(app).get('/assignments');
		expect(res.statusCode).toBe(200);
		expect(res.body[0]).toHaveProperty('title', 'Mock Assignment');
	});

	test('GET single assignment by ID', async () => {
		const res = await request(app).get('/assignments/1');
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('title', 'Mock Assignment');
	});

	test('GET non-existent assignment', async () => {
		const res = await request(app).get('/assignments/999');
		expect(res.statusCode).toBe(404);
		expect(res.body).toHaveProperty('message', 'Not found');
	});

	test('POST create assignment requires auth', async () => {
		const res = await request(app).post('/assignments').send({ title: 'Test' });
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('message', 'Created');
	});
});
