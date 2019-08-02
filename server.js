const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');
const morgan = require('morgan');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./middleware/authorization');
const redisClient = require("./redis/redisConnection");

const db = knex({
	client: 'pg',
	// Server connection
	 //connection: {
	// 	host: process.env.DATABASE_URL,
	// 	ssl: true
	// }
	// Localhost connect
	connection: process.env.POSTGRES_URI
});

const PORT = process.env.PORT || 3000;
const saltRounds = 10;
const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.send('It\'s working')});
app.post('/signin', signin.signinAuthentication(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt, saltRounds));
app.get('/profile/:id', auth.requireAuth, profile.handleProfileGet(db));
app.post('/profile/:id', auth.requireAuth, profile.handleProfileUpdate(db));
app.put('/image', auth.requireAuth, image.handleImage(db));
app.post('/imageurl', auth.requireAuth, image.handleApiCall());

console.log(`Redis client` ${redisClient});
app.listen(PORT, () => {
	console.log(`App is running on port ${PORT}`);
});
