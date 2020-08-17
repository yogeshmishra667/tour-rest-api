const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    select: false
  }
});

//for hashing password----------------------------------------------------//
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//for add in model (passwordChangedAt) when password change---------------//
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  /* -1000(1s):sometime token created before. after set timestamp so set [-1s] past so token is always created after the passwordChangedAt */

  next();
});

//for deactivate own account by user--------------------------------------//
userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

//for compare bcrypt (hashed) password------------------------------------//
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
  //we also compare manually but candidatePassword is not hashed password it's simple password send by user
};

//if anyone change password after token is issue -------------------------//
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000, //it convert in timestamp
      10 //10 is base number
    );
    console.log(JWTTimestamp, changedTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

//for reset password------------------------------------------------------//
userSchema.methods.createPasswordResetToken = function() {
  // crypto use for encrypted data
  const resetToken = crypto.randomBytes(32).toString('hex');
  //restToken is plain text token send user for reset password
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  //you can't store plain text token in database because someone stole
  //passwordResetToken is encrypted token for store in database

  //console.log( { resetToken },this.passwordResetToken );
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10min
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
