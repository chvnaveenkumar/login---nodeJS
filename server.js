var express = require('express');
var bodyParser = require('body-parser');
const _ = require('lodash');
var jwt = require('jsonwebtoken');

var { mongoose } = require('./db/mongoose');
var { Login } = require('./models/login');
var {authenticate} = require('./middleware/authenticate');
var {tokencheck} = require('./middleware/tokencheck');

var app = express();
app.use(bodyParser.json());
var cors = require('cors')
app.use(cors());

//Signup User, it create a new token to the user
app.post('/user/signup', (req,res) => {
    var body = _.pick(req.body,['email','password']);
    var login = new Login(body);
    login.token = login.generateAuthToken();
    login.save().then((user) => {
    res.header('x-auth', user.token).send(login);
    }).catch((e) => {
        console.log("error" + e);
        res.status(400).send(e);
    })
});

// Check the login user and generate temperory token to user to maintain session or do operations.
app.post('/user/login',(req,res) => {
    var body = _.pick(req.body,['email','password']);
    Login.findByCredentials(body.email,body.password).then((login) => {
        var newToken = login.generateAuthToken();
        return Login.updateToken(login.email,newToken).then(() => {
            res.send(newToken); 
        });
    }).catch((e) =>{
        res.status(400).send(e);
    });
});

// get the user details using the current token
app.post('/user/details',tokencheck,(req,res) => {
    console.log(req.body.sname);
    Login.findByUser(req.body.sname).then((user) =>{
        console.log(user.password);
        return res.send(user.password);
    }).catch((e) => {
        res.status(400).send("User details not found!!");
    });

});

app.get('/login/me',authenticate,(req,res) => {
    res.send(req.login);
});

app.listen(3000,()=>{
    console.log('Started up at port 3000');
});

module.exports = {app};

