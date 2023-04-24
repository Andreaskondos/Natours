const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, "Please write a review"],
      maxlength: [15, "Write a review with at least 15 characters length"],
    },
    rating: {
      type: Number,
      max: [5, "A rating cant be above 5"],
      min: [1, "A rating cant be below 1"],
      require: [true, "Please sumbit a rating between 1 and 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      require: [true, "A review needs a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "A review needs a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//Avoiding a user to post multiple reviews on the same tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Creating a static method to update the tour's avgRating and nRating after each new review about it
reviewSchema.statics.calcAvgRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats[0].length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "tour",
  //   select: "name ratingsAverage",
  // }).populate({
  //   path: "user",
  //   select: "name photo",
  // });
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.post("save", function () {
  //this keyword points to current review
  this.constructor.calcAvgRatings(this.tour);
});

//findByIdAndUpdate === findOneAndUpdate
//findByIdAndDelete === findOneAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  //this keyword points to the find query and not on the review, so i need to pass the review somehow from the pre to the post middleware when update or delete happens
  this.currentReview = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  //this keyword still points to the query, but with the "pre" middleware we created a parameter on the query (currentReview) which we can now have access
  await this.currentReview.constructor.calcAvgRatings(this.currentReview.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
