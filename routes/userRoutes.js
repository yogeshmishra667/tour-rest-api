const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//FOR PROTECT ALL THE ROUTE BELOW THIS MIDDLEWARE
router.use(authController.protect);

//FOR UPDATE CURRENT USER PASSWORD
router.patch('/updateMyPassword', authController.updatePassword);
//FOR GET CURRENT USER WITH USER.ID
router.get('/me', userController.getMe, userController.getUser);
//FOR UPDATE CURRENT USER
router.patch('/updateMe', authController.protect, userController.updateMe);
//FOR DELETE CURRENT USER
router.delete('/deleteMe', authController.protect, userController.deleteMe);

//FOR restrict ALL THE ROUTE BELOW THIS MIDDLEWARE FOR ONLY ADMIN
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
