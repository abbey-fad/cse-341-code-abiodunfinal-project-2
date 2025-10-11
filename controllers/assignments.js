const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all assignments
const getAll = async (req, res) => {
	try {
		const assignments = await mongodb
			.getDatabase()
			.collection('assignments')
			.find()
			.toArray();

		res.setHeader('Content-Type', 'application/json');
		res.status(200).json(assignments);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// GET single assignment by ID
const getSingle = async (req, res) => {
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid assignment id to find an assignment.');
	}

	try {
		const assignmentId = new ObjectId(req.params.id);
		const assignment = await mongodb
			.getDatabase()
			.collection('assignments')
			.findOne({ _id: assignmentId });

		if (!assignment) {
			return res.status(404).json({ message: 'Assignment not found.' });
		}

		res.setHeader('Content-Type', 'application/json');
		res.status(200).json(assignment);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// CREATE a new assignment
const createAssignment = async (req, res) => {
	const assignment = {
		userId: req.body.userId || null,
		title: req.body.title,
		description: req.body.description,
		dueDate: req.body.dueDate,
		status: req.body.status || 'pending',
		priority: req.body.priority || 'medium',
		notes: req.body.notes || '',
		courseId: req.body.courseId || null,
		createdAt: new Date()
	};

	try {
		const response = await mongodb
			.getDatabase()
			.collection('assignments')
			.insertOne(assignment);

		if (response.acknowledged) {
			res.status(201).json(response); 
		} else {
			res.status(500).json(response.error || 'Some error occurred while creating the assignment.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// UPDATE an assignment
const updateAssignment = async (req, res) => {
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid assignment id to update an assignment.');
	}

	const assignmentId = new ObjectId(req.params.id);
	const assignment = {
		userId: req.body.userId || null,
		title: req.body.title,
		description: req.body.description,
		dueDate: req.body.dueDate,
		status: req.body.status || 'pending',
		priority: req.body.priority || 'medium',
		notes: req.body.notes || '',
		courseId: req.body.courseId || null,
		updatedAt: new Date()
	};

	try {
		const response = await mongodb
			.getDatabase()
			.collection('assignments')
			.replaceOne({ _id: assignmentId }, assignment);

		if (response.modifiedCount > 0) {
			res.status(204).send();
		} else {
			res.status(500).json(response.error || 'Some error occurred while updating the assignment.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// DELETE an assignment
const deleteAssignment = async (req, res) => {
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid assignment id to delete an assignment.');
	}

	const assignmentId = new ObjectId(req.params.id);

	try {
		const response = await mongodb
			.getDatabase()
			.collection('assignments')
			.deleteOne({ _id: assignmentId });

		if (response.deletedCount > 0) {
			res.status(204).send();
		} else {
			res.status(500).json(response.error || 'Some error occurred while deleting the assignment.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = { getAll, getSingle, createAssignment, updateAssignment, deleteAssignment };
