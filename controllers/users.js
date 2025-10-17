const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
	try {
		const users = await mongodb
			.getDatabase()
			.collection('users')
			.find()
			.toArray();

		res.setHeader('Content-Type', 'application/json');
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getSingle = async (req, res) => {
	//#swagger.tags=['Users']
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid user id to find a user.');
	}

	try {
		const userId = new ObjectId(req.params.id);
		const user = await mongodb
			.getDatabase()
			.collection('users')
			.findOne({ _id: userId });

		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		res.setHeader('Content-Type', 'application/json');
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getProfile = async (req, res) => {
	try {
		const userId = req.user?._id || req.query.id; 

		if (!userId || !ObjectId.isValid(userId)) {
			return res.status(400).json({ message: 'A valid user ID is required.' });
		}

		const user = await mongodb
			.getDatabase()
			.collection('users')
			.findOne({ _id: new ObjectId(userId) });

		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const createUser = async (req, res) => {
	const user = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
		createdAt: new Date()
	};

	try {
		const response = await mongodb
			.getDatabase()
			.collection('users')
			.insertOne(user);

		if (response.acknowledged) {
			res.status(201).json(response); 
	    } else {
		    res.status(500).json(response.error || 'Some error occurred while updating the user.');
	    }
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const updateUser = async (req, res) => {
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid user id to update a user.');
	}

	const userId = new ObjectId(req.params.id);
	const user = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
		updatedAt: new Date()
	};

	try {
		const response = await mongodb
			.getDatabase()
			.collection('users')
			.replaceOne({ _id: userId }, user);

		if (response.modifiedCount > 0) {
			res.status(204).send();
		} else {
			res.status(500).json(response.error || 'Some error occurred while updating the user.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const deleteUser = async (req, res) => {
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid user id to delete a user.');
	}

	const userId = new ObjectId(req.params.id);

	try {
		const response = await mongodb
			.getDatabase()
			.collection('users')
			.deleteOne({ _id: userId });

		if (response.deletedCount > 0) {
			res.status(204).send();
		} else {
			res.status(500).json(response.error || 'Some error occurred while deleting the user.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = { getAll, getSingle, getProfile, createUser, updateUser, deleteUser };
