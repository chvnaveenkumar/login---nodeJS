var {Login} = require ('./../models/login')
var jwt = require('jsonwebtoken');

var tokencheck = (req,res,next) => {
    var token = req.header('x-auth');
    try {
        var decoded = jwt.verify(token, 'abc123');
        next(); 
      } catch(err) {
        // error
        res.status(401).send("error");
      }
};

module.exports = {tokencheck};