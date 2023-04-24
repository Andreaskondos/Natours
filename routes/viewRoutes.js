const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();
router.get("/me", authController.protect, viewController.getAccount);
router.get(
  "/my-bookings",
  authController.protect,
  bookingController.myBookings
);

router.use(authController.isLoggedIn);
router.get("/", bookingController.addBooking, viewController.getOverview);
router.get("/tour/:slug", viewController.getTour);
router.get("/login", viewController.loginScreen);

module.exports = router;
