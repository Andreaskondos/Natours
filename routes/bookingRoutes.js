const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.get("/checkout-session/:tourId", bookingController.checkoutSession);

router.use(authController.restrictTo("lead-guide", "admin"));
router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);
router
  .route("/:id")
  .get(bookingController.getBooking)
  .delete(bookingController.deleteBooking)
  .patch(bookingController.updateBooking);

module.exports = router;
