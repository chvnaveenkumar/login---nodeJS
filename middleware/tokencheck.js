var {Login} = require ('./../models/login')
var jwt = require('jsonwebtoken');
const _ = require('lodash');

var tokencheck = (req,res,next) => {
    var token = req.header('x-auth');
    console.log(req.email,token);
    if(!token)
    {
      var body = _.pick(req.body,['email','password']);
      return res.redirect("/user/login");
    }
    try {
      console.log("verifying token");
        var decoded = jwt.verify(token, 'abc123');
        next(); 
      } catch(err) {
        // error
      
        res.status(401).send("error");
      }
};

module.exports = {tokencheck};