const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');
//const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//FOR GET ALL TOUR USING FACTORY HANDLER
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
//FOR UPDATE TOUR USING FACTORY HANDLER
exports.createTour = factory.createOne(Tour);
//FOR UPDATE TOUR USING FACTORY HANDLER
exports.updateTour = factory.updateOne(Tour);
//FOR DELETE TOUR USING FACTORY HANDLER
exports.deleteTour = factory.deleteOne(Tour);

//GET STATS
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 }, //add 1 to all tour and return total
        numRating: { $sum: '$ratingsQuantity' },
        ratingAvg: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates' //deconstructs startDates array field
    },
    {
      $match: {
        startDates: {
          //it match start date to grater then 2021-1-1 from  less then 2021-12-31
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 }, //total no of tour month
        tours: { $push: '$name' }
        //also add name in fields because of name one are more then this reasons use push for array
      }
    },
    { $addFields: { month: '$_id' } }, //it add month with id data
    { $project: { _id: 0 } }, //it remove the id or delete
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  //for response
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
//
//
//

//use for some testing
// const fs = require('fs');

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// };
// };
