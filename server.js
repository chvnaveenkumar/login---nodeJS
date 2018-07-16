var express = require('express');
var bodyParser = require('body-parser');
const _ = require('lodash');
<<<<<<< HEAD
var jwt = require('jsonwebtoken');
=======
>>>>>>> 8bdf8a2dc807d1c91dfa9002a0d65620efa107ba

var { mongoose } = require('./db/mongoose');
var { Login } = require('./models/login');
var {authenticate} = require('./middleware/authenticate');
<<<<<<< HEAD
var {tokenchecl} = require('./middleware/tokenchecl');

var app = express();
app.use(bodyParser.json());
var cors = require('cors')
app.use(cors());
=======

var app = express();
app.use(bodyParser.json());
>>>>>>> 8bdf8a2dc807d1c91dfa9002a0d65620efa107ba

app.post('/login', (req,res) => {
    var body = _.pick(req.body,['email','password']);
    var login = new Login(body);
   
    login.save().then(() => {
        return login.generateAuthToken();
    }).then((token) => {
    res.header('x-auth', token).send(login);
    }).catch((e) => {
        console.log("error" + e);
        res.status(400).send(e);
    })
});

app.post('/login/user',(req,res) => {
    var body = _.pick(req.body,['email','password']);

    Login.findByCredentials(body.email,body.password).then((login) => {
<<<<<<< HEAD
        return   login.tempgenerateAuthToken().then((token) => {
            res.send(token); 
=======
        return   login.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(login); 
>>>>>>> 8bdf8a2dc807d1c91dfa9002a0d65620efa107ba
        });
    }).catch((e) =>{
        res.status(400).send();
    });
<<<<<<< HEAD
});

app.post('/user/details',tokenchecl,(req,res) => {
    var body = _.pick(req.body,['sname']);
    console.log("asdf",body);

    Login.findByCredentials(body.email,body.password).then((login) => {
        return   login.tempgenerateAuthToken().then((token) => {
            res.send(token); 
        });
    }).catch((e) =>{
        res.status(400).send();
    });
=======

>>>>>>> 8bdf8a2dc807d1c91dfa9002a0d65620efa107ba
});

app.get('/login/me',authenticate,(req,res) => {

    res.send(req.login);
});

app.listen(3000,()=>{
    console.log('Started up at port 3000');
});

module.exports = {app};

