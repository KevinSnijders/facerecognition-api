const jwt = require('jsonwebtoken');
//const redisClient = require("../redis/redisConnection");

const handleSignin = (db, bcrypt, req) => {
	const {email, password} = req.body;
	if (!email || !password) {
		return Promise.reject('Incorrect form submission, please fill in the fields');
	}
	return db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			return bcrypt.compare(password, data[0].hash).then(function (result) {
				if (result) {
					return db.select('*').from('users')
						.where('email', '=', email)
						.then(user => user[0])
						.catch(err => Promise.reject('unable to get user'))
				} else {
					return Promise.reject('The email address or password you entered is not valid, please try again');
				}
			});
		})
		.catch(err => err)
};

// const getAuthTokenId = (req, res) => {
// 	const { authorization } = req.headers;
// 	redisClient.get(authorization, (err, result) => {
// 		if (err || !result) {
// 			return res.status(400).json('Unauthorized');
// 		}
// 		return res.json({id: result});
// 	})
// };

// const signToken = (email) => {
// 	const jwtPayload = {email};
// 	return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'})
// };
//
// const setToken = (token, id) => {
// 	return Promise.resolve(redisClient.set(token, id))
// };

// const createSessions = (user) => {
// 	const {id, email} = user;
// 	const token = signToken(email);
// 	return setToken(token, id)
// 		.then(() => {
// 			return {success: 'true', userId: id, token}
// 		})
// 		.catch(console.log)
// };

const signinAuthentication = (db, bcrypt) => (req, res) => {
	const {authorization} = req.headers;
	// return authorization ? getAuthTokenId(req, res) :
	return handleSignin(db, bcrypt, req, res)
			// .then(data => {
			// 	return data.id && data.email ?
			// 		createSessions(data) : Promise.reject(data)
			// })
			.then(session => res.json(session))
			.catch(err => res.status(400).json(err))
};

module.exports = {
	signinAuthentication: signinAuthentication
};