const express = require("express");
const tourController = require("../controllers/tourControllers");

const tourRouter = express.Router();

tourRouter
  .route("/top-5-cheap")
  .get(tourController.cheapTours, tourController.getAllTours);

tourRouter.route("/stats").get(tourController.getTourStats);

tourRouter.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

tourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
