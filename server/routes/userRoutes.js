const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

router.use(authController.protect);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(authController.restrictTo('admin'), userController.createUser);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser)
  .patch(authController.restrictTo('admin'), userController.updateUser);

module.exports = router;
