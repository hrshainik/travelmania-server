const express = require("express");
const tourController = require("../controllers/tourControllers");
const authController = require("../controllers/authControllers");
const reviewController = require("../controllers/reviewControllers");

const router = express.Router();

router
  .route("/top-5-cheap")
  .get(tourController.cheapTours, tourController.getAllTours);

router.route("/stats").get(tourController.getTourStats);

router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.getMonthlyPlan
  );

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.deleteTour
  );

router
  .route("/:tourID/reviews")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  );

module.exports = router;
