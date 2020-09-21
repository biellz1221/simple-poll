const { users } = require('../db/db');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
	const token = req.header('Authorization').replace('Bearer ', '');
	try {
		const data = jwt.verify(token, process.env.JWT_KEY);
		const user = await users.findOne({ email: data.email, tokens: token });
		if (!user) {
			throw new Error();
		}
		req.user = user;
		req.token = token;
		next();
	} catch (err) {
		console.log(err);
		res.status(403).send({ error: 'Not Authorized to access this resource.' });
	}
};

module.exports = auth;
