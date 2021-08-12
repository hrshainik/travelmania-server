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
  photo: String
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(passwordFront, passwordDB) {
  return await bcrypt.compare(passwordFront, passwordDB);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
