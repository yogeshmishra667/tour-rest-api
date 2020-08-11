//const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    //BUILD
    //1)filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    //1A)ADVANCE FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    //2) SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      //split() split the query in two part where find , and merge with space
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createAt');
    }

    //3)FIELDS LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');

      query = query.select(fields);
    } else {
      query = query.select('-__v');
      //it remove __v
    }

    //4) PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 1;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('page does not exist');
    }

    //EXECUTE QUERY
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

exports.getTour = async (req, res) => {
  // const id = req.params.id * 1;
  //const tour = tours.find(el => el.id === id);

  const tour = await Tour.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({});
  // await newTour.save();
  //instead of use create ()
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndRemove(req.params.id);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

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
