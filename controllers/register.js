const handleRegister = (db, bcrypt, saltRounds) => (req, res) => {
	const {email, name, password} = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('Incorrect form submission, please fill in the fields');
	}
	bcrypt.genSalt(saltRounds, function (err, salt) {
		bcrypt.hash(password, salt, function (err, hash) {
			db.transaction(trx => {
				trx.insert({
					hash: hash,
					email: email
				})
					.into('login')
					.returning('email')
					.then(loginEmail => {
						return trx('users')
							.returning('*')
							.insert({
								name: name,
								email: loginEmail[0],
								joined: new Date()
							})
							.then(user => {
								res.json(user[0]);
							})
					})
					.then(trx.commit)
					.catch(trx.rollback);
			})
				.catch(err => res.status(400).json('This email address is already in use, please use a different email address'))
		})
	});
};

module.exports = {
	handleRegister: handleRegister
};