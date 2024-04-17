const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const obj = jwt.verify(token, 'secretkey');
       /// console.log(obj);
        User.findById(obj.userId).then(user => {
            req.user = user;
            // console.log(user);
            req.userId = user._id;
            next();
        }).catch(err => { throw new Error(err) });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
    }
}