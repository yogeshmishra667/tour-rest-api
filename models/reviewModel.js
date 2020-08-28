const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema(
  {
    reviews: {
      type: String,
      required: [true, 'review can not be empty!']
    },
    rating: { type: Number, min: 1, max: 6 },
    createAt: { type: Date, default: Date.now() },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//USER AND TOUR MUST BE UNIQUE (one user only one review on one tour)
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//for populate data from user model to review
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

//FOR CALCULATE AVERAGE RATING
//use static method because want to point current model using this
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  //console.log(stats);
  //IF DATA IS MORE THEN 1 SO DISPLAY CALCULATED AVERAGE OTHERWISE DISPLAY DEFAULT AVERAGE
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  // this points to current
  //constructor point the current MODEL who is created
  this.constructor.calcAverageRatings(this.tour);
});

//ALSO CALCULATE AVERAGE FOR WHEN DATA DELETE OR UPDATE
// findByIdAndUpdate
// findByIdAndDelete //BOTH QUERY USE BTS AT FIND_ONE_AND QUERY
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  //this.r for transfer query data pre to post middleware
  //PRE RUN AFTER THE DATA SAVE & findOne RETRIEVE DATA BUT (PRE) IT CAN'T UPDATE & DELETE DATA BECAUSE ITS ONLY RUN AFTER DATA SAVE

  //console.log(this.r);
  next();
});
//1)POST ALSO USE BECAUSE SOME PROBLEM WITH (PRE) SO SOLVE THIS PROBLEM ALSO USE POST FOR UPDATE AND DELETE AVERAGE BEFORE SAVE DATA
// 2)POST IS ONLY MIDDLEWARE FOR CALCULATE AVERAGE

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
