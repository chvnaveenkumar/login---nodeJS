var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Profile');
mongoose.Promise = global.Promise;

mongoose.exports = { mongoose };