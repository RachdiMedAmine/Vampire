const Review = require('./../models/reviewsModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/app-Errors');

exports.setIDs = (req, res, next) => {
  req.body.tour = req.params.tourId;
  req.body.user = req.user.id;
  next();
};

exports.checkOwner = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate('user');
  if (
    req.user._id.toString() !== review.user._id.toString() &&
    req.user.role !== 'admin'
  )
    return next(new AppError("You don't have permission to do this", 401));
  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.addReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
