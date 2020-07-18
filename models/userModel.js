const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A name must have less or equal than 40 characters']
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      validate: [validator.isEmail, 'wrong email format'],
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'a user must have a password'],
      select: false
    },
    birthdate: {
      type: Date,
      required: [true, 'A user must have a birthdate']
    },
    bio: {
      type: String,
      trim: true,
      default: ''
    },
    image: {
      type: String,
      default: 'user.jpeg'
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual('age').get(function() {
  // new Date().getFullYear();
  // return Date.now().y
  // this.birthdate
  console.log(Date.now());
});

// Hash the passwords before storing them in the database
userSchema.pre('save', async function(next) {
  if (this.isModified('password'))
    this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

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

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
