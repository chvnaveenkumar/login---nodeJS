var express = require('express');
var bodyParser = require('body-parser');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { Login } = require('./models/login');

var app = express();
app.use(bodyParser.json());

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

app.listen(3000,()=>{
    console.log('Started up at port 3000');
});

module.exports = {app};

