const express = require("express");
const tourController = require("../controllers/tourControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

router
  .route("/top-5-cheap")
  .get(tourController.cheapTours, tourController.getAllTours);

router.route("/stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.deleteTour
  );

module.exports = router;
