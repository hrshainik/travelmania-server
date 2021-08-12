const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getToken = function(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.singup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = getToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  const correctPass = user && user.correctPassword(password, user.password);

  if (!user || !correctPass) {
    return next(new AppError("Incorrect email or password!", 401));
  }

  const token = getToken(user._id);

  res.status(200).json({
    status: "success",
    token
  });
});
