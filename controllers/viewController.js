//FOR ROOT PAGE
exports.getRoot = (req, res, next) => {
  res.render('base', {
    user: 'yogesh mishra',
    tour: 'yogi-tours'
  });
};
//FOR OVERVIEW PAGE
exports.getOverview = (req, res, next) => {
  res.render('overview', {
    title: 'All tours'
  });
};
//FOR TOUR PAGE
exports.getTour = (req, res, next) => {
  res.render('tour', {
    title: 'the forest hiker'
  });
};
