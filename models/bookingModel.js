const mongoose = require("mongoose");

const bookingShema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    require: [true, "A booking must belong to a tour"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: [true, "A booking must belong to a user"],
  },
  price: {
    type: Number,
    require: [true, "A booking must have a price"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingShema.pre(/^find/, function (next) {
  this.populate("user").populate({ path: "tour", select: "name" });
  next();
});

const Booking = mongoose.model("Booking", bookingShema);

module.exports = Booking;
