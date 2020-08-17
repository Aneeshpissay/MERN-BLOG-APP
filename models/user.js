var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    email: {
      type: String,
        default: ''
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    active: Boolean,
    verifyEmail: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);