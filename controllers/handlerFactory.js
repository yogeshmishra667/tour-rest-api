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
