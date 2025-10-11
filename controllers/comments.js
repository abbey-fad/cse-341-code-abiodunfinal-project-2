const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all comments for an assignment
const getCommentsByAssignment = async (req, res) => {
	if (!ObjectId.isValid(req.params.assignmentId)) {
		return res.status(400).json('Must use a valid assignment id to get comments.');
	}

	try {
		const comments = await mongodb
			.getDatabase()
			.collection('comments')
			.find({ assignmentId: req.params.assignmentId })
			.toArray();

		res.setHeader('Content-Type', 'application/json');
		res.status(200).json(comments);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// CREATE a new comment
const createComment = async (req, res) => {
	const comment = {
		assignmentId: req.body.assignmentId,
		userId: req.body.userId,
		commentText: req.body.commentText,
		createdAt: new Date()
	};

	try {
		const response = await mongodb
			.getDatabase()
			.collection('comments')
			.insertOne(comment);

		if (response.acknowledged) {
			res.status(201).json(response); 
		} else {
			res.status(500).json(response.error || 'Some error occurred while creating the comment.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// DELETE a comment
const deleteComment = async (req, res) => {
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid comment id to delete a comment.');
	}

	const commentId = new ObjectId(req.params.id);

	try {
		const response = await mongodb
			.getDatabase()
			.collection('comments')
			.deleteOne({ _id: commentId });

		if (response.deletedCount > 0) {
			res.status(204).send();
		} else {
			res.status(500).json(response.error || 'Some error occurred while deleting the comment.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = { getCommentsByAssignment, createComment, deleteComment };
