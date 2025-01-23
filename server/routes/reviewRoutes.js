const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.setIDs,
    reviewController.addReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.protect,
    reviewController.checkOwner,
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    reviewController.checkOwner,
    reviewController.deleteReview
  );

module.exports = router;
