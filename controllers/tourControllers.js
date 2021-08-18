const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const AppError = require("../utils/appError");

exports.cheapTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,ratingsAverage";
  next();
};

exports.getAllTours = handlerFactory.getAll(Tour);
exports.createTour = handlerFactory.createOne(Tour);
exports.getTour = handlerFactory.getOne(Tour, { path: "reviews" });
exports.updateTour = handlerFactory.updateOne(Tour);
exports.deleteTour = handlerFactory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    // {
    //   $match: { ratingsAverage: { $gte: 4.7 } },
    // },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    },
    {
      $sort: {
        avgPrice: 1
      }
    }
    // {
    //   $match: { _id: { $ne: "easy" } },
    // },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates"
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {
          $month: "$startDates"
        },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" }
      }
    },
    {
      $sort: {
        numTourStarts: -1
      }
    },
    {
      $addFields: {
        month: "$_id"
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan
    }
  });
});

// /tours-within/:distance/center/:latlng/unit/:unit
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  let radius;
  if (unit === "mi") {
    radius = distance / 3963.2;
  } else if (unit === "km") {
    radius = distance / 6378.1;
  }

  if (!lat || !lng)
    return next(
      new AppError(
        "Please provide a latitude and longitude in the format lat,lng",
        400
      )
    );

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: "success",
    result: tours.length,
    data: tours
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  let multiplier;
  if (unit === "mi") {
    multiplier = 0.000621371;
  } else if (unit === "km") {
    multiplier = 0.001;
  }

  if (!lat || !lng)
    return next(
      new AppError(
        "Please provide a latitude and longitude in the format lat,lng",
        400
      )
    );

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: "distance",
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        name: 1,
        distance: 1
      }
    }
  ]);

  res.status(200).json({
    status: "success",
    data: distances
  });
});
