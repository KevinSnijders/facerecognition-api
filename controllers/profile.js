const handleProfileGet = (db) => (req, res) => {
	const {id} = req.params;
	db.select('*').from('users').where({id: id}).then(user => {
		if (user.length) {
			res.json(user[0]);
		} else {
			res.status(400).json('Not found');
		}
	}).catch(err => status(400).json('error getting user'));
};

const handleProfileUpdate = (db) => (req, res) => {
	const {id} = req.params;
	const {name} = req.body.formInput;
	console.log(req.params);
	db('users')
		.where({id})
		.update({name})
		.then(response => {
			if(response) {
				res.json("Succes");
			}
			res.status(400).json('unable to update')
		})
		.catch(err => res.status(400).json('error updating user'));
};

module.exports = {
	handleProfileGet: handleProfileGet,
	handleProfileUpdate
};

