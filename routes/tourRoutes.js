const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTop5Cheap, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getStatsTour);

router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("lead-guide", "admin", "guide"),
    tourController.getMonthlyPlan
  );

//tours-within/:400/center/34.05243443462476,-118.22258849308382/unit:mi
router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);
router
  .route("/distances/:latlng/unit/:unit")
  .get(tourController.getToursDistance);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("lead-guide", "admin"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("lead-guide", "admin"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("lead-guide", "admin"),
    tourController.deleteTour
  );

module.exports = router;
