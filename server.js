const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');
const saltRounds = 10;
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'postgres',
		password: 'welkom01',
		database: 'smart-brain'
	}
});

const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {});
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt, saltRounds));
app.get('/profile/:id', profile.handleProfileGet(db));
app.put('/image', image.handleImage(db));
app.post('/imageurl', image.handleApiCall());

app.listen(PORT, () => {
	console.log(`App is running on port ${PORT}`);
});
