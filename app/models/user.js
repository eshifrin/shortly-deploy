// var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var users = new Schema({
  username: String,
  password: String,
  timestamp: { type: Date, default: Date.now }
});

users.pre('save', function(next) {
  cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
  .then(function(hash) {
    this.password = hash;
    next();
  });
});

var Users = mongoose.model('users', users);
Users.comparePassword = function(attemptedPassword, userPassword, callback) {
  console.log('in here', attemptedPassword, userPassword);
  bcrypt.compare(attemptedPassword, userPassword, function(err, isMatch) {
    callback(null, isMatch);
  });
};

module.exports = Users;
