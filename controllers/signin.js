const handleSignin = (db, bcrypt) => (req, res) => {
	console.log(req);
	const {email, password} = req.body;
	if (!email || !password) {
		return res.status(400).json('Incorrect form submission, please fill in the fields');
	}
	db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			bcrypt.compare(password, data[0].hash, function (error, result) {
				if (result) {
					return db.select('*').from('users')
						.where('email', '=', email)
						.then(user => {
							res.json(user[0])
						}).catch(err => res.status(400).json('unable to get user'))
				} else {
					res.status(400).json('The email address or password you entered is not valid, please try again');
				}
			});
		}).catch(err => res.status(400).json('The email address or password you entered is not valid, please try again'));
};

module.exports = {
	handleSignin: handleSignin
};