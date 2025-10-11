const validator = require('../helpers/validate');

const saveUser = (req, res, next) => {
	const validationRule = {
		name: 'required|string',
		email: 'required|email',
		role: 'in:student,teacher'
	};

	validator(req.body, validationRule, {}, (err, status) => {
		if (!status) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				data: err
			});
		} else {
			next();
		}
	});
};

const saveAssignment = (req, res, next) => {
	const validationRule = {
		title: 'required|string',
		description: 'required|string',
		dueDate: 'required|date',
		status: 'in:pending,in-progress,completed',
		priority: 'in:low,medium,high'
	};

	validator(req.body, validationRule, {}, (err, status) => {
		if (!status) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				data: err
			});
		} else {
			next();
		}
	});
};

module.exports = {
	saveUser,
	saveAssignment
};
