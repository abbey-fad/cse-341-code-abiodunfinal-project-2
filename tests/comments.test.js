const request = require('supertest');

jest.mock('../middleware/authenticate', () => ({
	isAuthenticated: (req, res, next) => next(),
}));

jest.mock('../controllers/comments', () => ({
	getCommentsByAssignment: (req, res) => res.status(200).json([{ _id: '1', text: 'Mock Comment' }]),
	createComment: (req, res) => res.status(201).json({ message: 'Comment created' }),
	deleteComment: (req, res) => res.status(200).json({ message: 'Comment deleted' }),
}));

const app = require('../server');

describe('Comments API', () => {
	test('GET comments by assignment', async () => {
		const res = await request(app).get('/comments/assignment/1');
		expect(res.statusCode).toBe(200);
		expect(res.body[0]).toHaveProperty('text', 'Mock Comment');
	});

	test('POST comment', async () => {
		const res = await request(app).post('/comments').send({ text: 'Test' });
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('message', 'Comment created');
	});
});
