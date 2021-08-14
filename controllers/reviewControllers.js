const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req, res) => {
  let filter = {};

  if (req.params.tourID) filter = { tour: req.params.tourID };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res) => {
  // const review = await Review.create({
  //   review: req.body.review,
  //   rating: req.body.rating
  // });
  // Allow nested route
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user._id;

  const review = await Review.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      review
    }
  });
});
