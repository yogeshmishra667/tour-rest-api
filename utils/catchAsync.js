module.exports = fn => {
  //this function should we called when tour created 🔻
  return (req, res, next) => {
    fn(req, res, next).catch(next);
    //if any error occur it catch error and send error controller 🔺
  };
};

// this function() return new anonymous function() which will then assign in createTour controller // 🔺

//create catchAsync() because when you develop controller generally it return promise but for promise catch error use try-catch method but again and again repeat we can create septate function 🔺
