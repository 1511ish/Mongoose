const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.usergethomePage = (request, response, next) => {
    response.sendFile('test.html', { root: 'views' });
}

function isStringInvalid(string) {
    if (string == undefined || string.length === 0)
        return true;
    else
        return false;
}

exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (isStringInvalid(name) || isStringInvalid(password) || isStringInvalid(password)) {
            return res.status(400).json({ err: 'Bad parameters, Something is missing' })
        }
        const salt = await bcrypt.genSalt();
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                console.log(err);
                res.status(500).json({ err: err });
            }
            // await User.create({ name: name, email_Id: email, password: hash });
            const user = new User({
                name: name,
                email_Id: email,
                password: hash,
            })
            user.save()
                .then(result => {
                    res.status(201).json({ message: 'Successfully created new user' });
                    console.log('SUCCESSFULLY ADDED');
                })
                .catch(err => console.log(err));
        })
    }
    catch (err) {
        res.status(500).json(err);
    }
}


function generateAccessToken(id, ispremiumuser) {
    return jwt.sign({ userId: id, isPremium: ispremiumuser }, 'secretkey');
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (isStringInvalid(email) || isStringInvalid(password)) {
        return res.status(400).json({ message: 'email or password is missing', success: false })
    }
    try {
        let userExist = await User.findOne({ email_Id: email });
        if (!userExist) {
            response.status(404).send('User not found');
        } else {
            const isPasswordValid = await bcrypt.compare(password, userExist.password);
            if (isPasswordValid) {
                const userId = userExist._id.toString();
                // const token = jwt.sign({ userId: userId }, secretKey, { expiresIn: '1h' });
                const token = generateAccessToken(userId, userExist.ispremiumuser);
                console.log("password is valid.")
                return res.status(200).json({ token: token, user: userExist });
            } else {
                // response.status(401).send('Authentication failed');
                console.log("password is invalid.")
                return res.status(400).json({ success: false, message: 'Password is incorrect' });
            }
        }
    } catch (err) {
        res.status(500).json({ message: err, success: false });
    }

}

