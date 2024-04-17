const express = require('express');

const router = express.Router();

const userController = require('../contoller/user');

router.post('/signup', userController.signUp);

router.post('/login',userController.login);

router.get('',userController.usergethomePage);

module.exports = router;
