const express = require("express");
const tourController = require("../controllers/tourControllers");
const authController = require("../controllers/authControllers");
const reviewRouter = require("../routes/reviewRoutes");

const router = express.Router();

router.use("/:tourID/reviews", reviewRouter);

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
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

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

module.exports = router;
