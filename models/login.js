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
    token:{
        type: String,
        required: true
    } 
});

LoginSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
};

LoginSchema.methods.generateAuthToken = function(){
    var login = this;
    var gen_token = jwt.sign({_id: login._id.toHexString(), access},'abc123',{ expiresIn: 1 * 30 }).toString();
    return gen_token;
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

LoginSchema.statics.findByCredentials = function (email, password){
    var Login = this;
    return Login.findOne({email}).then((login) => {
        if(!login){
            return Promise.reject();
        }
        return new Promise((resolve, reject) =>{
            //Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password,login.password,(err,res) => {
                if(res){
                  resolve(login);
                }else{
                    reject();
                }
            });
        });
    });
};

LoginSchema.statics.updateToken = function(email,newtoken) {
 var Login = this;
 return  Login.updateOne({email},{$set: {token: newtoken}}, (err,res) =>{
    if(err){
        return Promise.reject();
    }
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