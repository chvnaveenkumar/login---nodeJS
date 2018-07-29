const express = require('express');
const router = express.Router()
const usersController = require('./controllers/user.controller');

router.get('/', (req,res) => {
    res.render('index');
});

router.post('/singup', usersController.signUp);
router.post('/signin', usersController.signIn);
router.post('/details',usersController.details);

module.exports = router