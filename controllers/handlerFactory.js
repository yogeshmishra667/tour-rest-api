// THIS FILE FOR REFACTORING REPEATABLE CODE IN CRUD OPERATION
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//FOR DELETE HANDLER FUNCTION
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.findByIdAndRemove(req.params.id);
    if (!docs) {
      return next(new AppError(`No documents found with that ID`, 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

//FOR UPDATE HANDLER FUNCTION
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

//FOR CREATE HANDLER FUNCTION
exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

//FOR GET HANDLER FUNCTION
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
