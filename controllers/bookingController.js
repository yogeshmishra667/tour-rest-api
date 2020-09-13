const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
//const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // console.log(tour);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100 * 70,
        currency: 'inr',
        quantity: 1
      }
    ]
  });
  // console.log(session);
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

//FOR STORE BOOKING IM DATABASE
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURED: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

//FETCH ALL BOOKING
exports.getAllBookings = catchAsync(async (req, res, next) => {
  const booking = await Booking.find();

  if (!booking) {
    return next(new AppError('No booking found with that info', 404));
  }

  res.status(200).json({
    status: 'success',
    results: booking.length,
    data: {
      data: booking
    }
  });
});

//CREATE BOOKING
exports.createBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      data: booking
    }
  });
});

//FETCH SINGLE BOOKING
exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: booking
    }
  });
});

//UPDATE BOOKING
exports.updateBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: booking
    }
  });
});

//DELETE BOOKING
exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndRemove(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: null
    }
  });
});
