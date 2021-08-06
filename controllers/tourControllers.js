const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

exports.cheapTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,ratingsAverage";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // Execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filer()
      .sort()
      .limitFields()
      .pagination();

    const tour = await features.query;

    res.status(200).json({
      status: "success",
      result: tour.length,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(200).json({
      tour,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findOne({ _id: req.params.id });
    res.status(200).json({
      tour,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      tour,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      tour,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
    });
  }
};
