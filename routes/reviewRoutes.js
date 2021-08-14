const express = require("express");
const reviewController = require("../controllers/reviewControllers");
const authController = require("../controllers/authControllers");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  );

module.exports = router;
