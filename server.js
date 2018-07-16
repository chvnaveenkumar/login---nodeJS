var express = require('express');
var bodyParser = require('body-parser');
const _ = require('lodash');
var jwt = require('jsonwebtoken');

var { mongoose } = require('./db/mongoose');
var { Login } = require('./models/login');
var {authenticate} = require('./middleware/authenticate');
var {tokenchecl} = require('./middleware/tokenchecl');

var app = express();
app.use(bodyParser.json());
var cors = require('cors')
app.use(cors());

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
        return   login.tempgenerateAuthToken().then((token) => {
            res.send(token); 
        });
    }).catch((e) =>{
        res.status(400).send();
    });
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
});

app.get('/login/me',authenticate,(req,res) => {

    res.send(req.login);
});

app.listen(3000,()=>{
    console.log('Started up at port 3000');
});

module.exports = {app};

