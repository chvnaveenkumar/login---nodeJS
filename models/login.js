var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

LoginSchema.statics.findByToken = function (token){
    var Login = this;
    var decoded;
    try{
        decoded = jwt.verify(token, 'abc123');
    }catch(e){
        return Promise.reject('test');
    }
    return Login.findOne({ 
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

LoginSchema.pre('save', function(next) {
    var login = this;
    if(login.isModified('password')){
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(login.password,salt,(err,hash) => {
                login.password = hash;
                next();
            })
        });

    }else{
        next();
    }


});

var Login = mongoose.model('Login', LoginSchema);

module.exports = {Login};