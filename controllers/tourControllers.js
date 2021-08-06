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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.7 } },
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
      // {
      //   $match: { _id: { $ne: "easy" } },
      // },
    ]);

    res.status(200).json({
      stats,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$startDates",
          },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $sort: {
          numTourStarts: -1,
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      result: plan.length,
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
    });
  }
};
