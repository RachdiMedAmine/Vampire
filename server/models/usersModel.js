const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'please add a first name']
  },
  lastName: {
    type: String,
    required: [true, 'please add a last name']
  },
  photo: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'please provide an email'],
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'please enter a valid email'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'please enter a password'],
    minlength: [8, 'password must contain at least 8 letters and numbers'],
    select: false,
    validate: [
      {
        validator: function(value) {
          return /[a-zA-Z]/.test(value);
        },
        message: 'Password must contain at least one letter.'
      },
      {
        validator: function(value) {
          return /[0-9]/.test(value);
        },
        message: 'Password must contain at least one number.'
      }
    ]
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: "Passwords don't match"
    }
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  }
});

//ENCRYPT THE PASSWORD
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//CHECK IF THE PASSWORD HAS BEEN CHANGED COMPARED TO NOW
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//CHECK IF THE ENTERED PASSWORD IS CORRECT
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//CHECK IF THE PASSWORD HAS BEEN GENERATED AFTER THE RESET TOKEN
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

//CREATE THE PASSWORD RESET TOKEN
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
