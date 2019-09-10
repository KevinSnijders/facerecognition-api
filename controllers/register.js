const handleRegister = (db, bcrypt, saltRounds) => (req, res) => {
    const {name, password} = req.body;
    const email = toLowerCaseEmail(req.body.email);
    if (!email || !name || !password) {
        return res.status(400).json({
            success: 'false',
            message: 'Incorrect form submission, please fill in the fields'
        });
    } else if (!validateEmail(email)) {
        return res.status(400).json({
            success: 'false',
            message: 'Incorrect form submission, please fill in a correct email address'
        });
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
                                res.json({success: true, user: user[0]});
                            })
                    })
                    .then(trx.commit)
                    .catch(trx.rollback);
            })
                .catch(err => res.status(400).json({
                    success: 'false',
                    message: 'This email address is already in use, please use a different email address'
                }))
        })
    });
};

const validateEmail = (email) => {
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(String(email).toLowerCase());
};

const toLowerCaseEmail = (email) => {
    return email.toLowerCase();
};

module.exports = {
    handleRegister: handleRegister
};