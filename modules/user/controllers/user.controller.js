const _ = require('lodash');

var { mongoose } = require('./../../../db/mongoose');
var { Login } = require('./user.schemas');
var {tokencheck} = require('./../../../middleware/tokencheck');

let signUp = (req,res) => {
    var body = _.pick(req.body,['email','password']);
    var login = new Login(body);
    login.token = login.generateAuthToken();
    login.save().then((user) => {
    res.header('x-auth', user.token).send(login);
    }).catch((e) => {
        console.log("error" + e);
        res.status(400).send(e);
    })
}

module.exports.signUp = signUp;

let signIn = (req,res) => {
    var body = _.pick(req.body,['email','password']);
    Login.findByCredentials(body.email,body.password).then((login) => {
        var newToken = login.generateAuthToken();
        console.log(login.email);
        return Login.updateToken(login.email,newToken).then((result) => {
            
            if(!result){
                return res.json({ code: 403, message: err });
            }
            return res.json({ code: 200, message: "User signin successful", token: newToken });           
        });
    }).catch((err) =>{
        res.json({ code: 403, message: err });
    });
}

module.exports.signIn = signIn;

let details = (req,res) => {    
    console.log(req.body.sname);
    Login.findByUser(req.body.sname).then((user) =>{
        console.log(user.password);
        return res.send(user.password);
    }).catch((e) => {
        res.status(400).send("User details not found!!");
    });
}

module.exports.details = details;