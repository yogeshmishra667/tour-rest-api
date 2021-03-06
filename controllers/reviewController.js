const Review = require('../models/reviewModel');
const factory = require('../controllers/handlerFactory');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

//for fetch all review
// exports.getAllReview = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const reviews = await Review.find(filter);

//   if (!reviews) {
//     return next(new AppError('No review found', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     result: reviews.length,
//     data: {
//       reviews
//     }
//   });
// });

//for creating new review
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//FOR GET ALL REVIEW USING FACTORY HANDLER
exports.getAllReview = factory.getAll(Review);
//FOR GET REVIEW USING FACTORY HANDLER
exports.getReview = factory.getOne(Review);
//FOR CREATE REVIEW USING FACTORY HANDLER
exports.createReview = factory.createOne(Review);
//FOR UPDATE REVIEW USING FACTORY HANDLER
exports.updateReview = factory.updateOne(Review);
//FOR DELETE REVIEW USING FACTORY HANDLER
exports.deleteReview = factory.deleteOne(Review);
