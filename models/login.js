var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
const _ = require('lodash');

var LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 5,
        validate:{
            validator: (value) =>{
                return validator.isEmail(value);
            }
        }
    },
    password:{
        type: String,
        require: true,
        minlength: 6
     },
     tokens: [{
        access: {
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }] 
});
LoginSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['_id','email']);
};

LoginSchema.methods.generateAuthToken = function(){
    var login = this;
    var access = 'auth';
    var token = jwt.sign({_id: login._id.toHexString(), access},'abc123').toString();
    login.tokens.push({access, token});
    return login.save().then(() => {
        return token;
    });
};

var Login = mongoose.model('Login', LoginSchema);

module.exports = {Login};