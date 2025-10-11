const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all courses
const getAll = async (req, res) => {
	try {
		const courses = await mongodb
			.getDatabase()
			.collection('courses')
			.find()
			.toArray();

		res.setHeader('Content-Type', 'application/json');
		res.status(200).json(courses);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// GET single course by ID
const getSingle = async (req, res) => {
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid course id to find a course.');
	}

	try {
		const courseId = new ObjectId(req.params.id);
		const course = await mongodb
			.getDatabase()
			.collection('courses')
			.findOne({ _id: courseId });

		if (!course) {
			return res.status(404).json({ message: 'Course not found.' });
		}

		res.setHeader('Content-Type', 'application/json');
		res.status(200).json(course);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// CREATE a new course
const createCourse = async (req, res) => {
	const course = {
		courseName: req.body.courseName,
		courseCode: req.body.courseCode,
		description: req.body.description,
		teacherId: req.body.teacherId,
		semester: req.body.semester,
		createdAt: new Date()
	};

	try {
		const response = await mongodb
			.getDatabase()
			.collection('courses')
			.insertOne(course);

		if (response.acknowledged) {
			res.status(201).json(response); 
		} else {
			res.status(500).json(response.error || 'Some error occurred while creating the course.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// UPDATE a course
const updateCourse = async (req, res) => {
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid course id to update a course.');
	}

	const courseId = new ObjectId(req.params.id);
	const course = {
		courseName: req.body.courseName,
		courseCode: req.body.courseCode,
		description: req.body.description,
		teacherId: req.body.teacherId,
		semester: req.body.semester,
		updatedAt: new Date()
	};

	try {
		const response = await mongodb
			.getDatabase()
			.collection('courses')
			.replaceOne({ _id: courseId }, course);

		if (response.modifiedCount > 0) {
			res.status(204).send();
		} else {
			res.status(500).json(response.error || 'Some error occurred while updating the course.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// DELETE a course
const deleteCourse = async (req, res) => {
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid course id to delete a course.');
	}

	const courseId = new ObjectId(req.params.id);

	try {
		const response = await mongodb
			.getDatabase()
			.collection('courses')
			.deleteOne({ _id: courseId });

		if (response.deletedCount > 0) {
			res.status(204).send();
		} else {
			res.status(500).json(response.error || 'Some error occurred while deleting the course.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = { getAll, getSingle, createCourse, updateCourse, deleteCourse };
