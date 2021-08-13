const express = require("express");
const reviewController = require("../controllers/reviewControllers");

const router = express.Router();

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);

router
  .route("/:id")
  .get()
  .patch()
  .delete();

module.exports = router;
