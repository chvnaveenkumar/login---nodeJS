var jwt = require('jsonwebtoken');
const _ = require('lodash');

var tokencheck = (req,res,next) => {
    var token = req.header('x-auth') || req.body.token ;
    if(token)
    {
     jwt.verify(token, 'abc123', (err, decoded) =>{
        if(err)
        {
          return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
        req.decoded = decoded;
        next();
     });
    } else{
      next();
      }
  };
        
module.exports = {tokencheck};