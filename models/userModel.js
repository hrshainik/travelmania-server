const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name!"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "User must have a email!"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email!"]
  },
  password: {
    type: String,
    required: [true, "User must have a password!"],
    trim: true,
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      // This only works on save!
      validator: function(val) {
        return val === this.password;
      },
      message: "Passwords are not the same!"
    }
  },
  passwordChangedAt: {
    type: Date
  },
  photo: String,
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "guide", "admin"],
      message:
        "Role can't be anything! This app has three role(user, guide, admin)."
    }
  },
  passResetToken: String,
  passResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function(next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({ active: true });
  next();
});

userSchema.methods.correctPassword = async function(passwordFront, passwordDB) {
  return await bcrypt.compare(passwordFront, passwordDB);
};

userSchema.methods.changedPassAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp; // jwt issued time < passwordchangedtime
  }
  return false;
};

userSchema.methods.createPassResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passResetExpires = Date.now() + 10 * 60 * 1000; // 10min

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
