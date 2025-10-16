const router = require('express').Router();
const passport = require('passport');

// Swagger routes
router.use('/', require('./swagger'));

// Users routes
router.use('/users', require('./users'));

// Assignments routes
router.use('/assignments', require('./assignments'));

// Courses routes
router.use('/courses', require('./courses'));

// Comments routes
router.use('/comments', require('./comments'));

// GitHub authentication routes
router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
	'/github/callback',
	passport.authenticate('github', { failureRedirect: '/' }),
	(req, res) => {
		req.session.user = req.user;
		res.redirect('/'); 
	}
);

// Logout route
router.get('/logout', (req, res, next) => {
	req.logout(function (err) {
		if (err) { return next(err); }
		req.session.destroy(() => {
			res.clearCookie('connect.sid'); // Clear session cookie
			res.send('You have been logged out successfully.');
		});
	});
});


module.exports = router;
