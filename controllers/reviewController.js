const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');

//for fetch all review
exports.getAllReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  if (!reviews) {
    return next(new AppError('No review found', 404));
  }

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews
    }
  });
});

//for creating new review
exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      reviews: newReview
    }
  });
});

//FOR UPDATE REVIEW USING FACTORY HANDLER
exports.updateReview = factory.updateOne(Review);
//FOR DELETE REVIEW USING FACTORY HANDLER
exports.deleteReview = factory.deleteOne(Review);
