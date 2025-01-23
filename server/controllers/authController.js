const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/usersModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/app-Errors');
const sendEmail = require('./../utils/email');

//generate token
const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 3600 * 1000 //CONVERTING TO MS
    ),
    httpOnly: true //cookie can't be accessed or modified by browser
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //add the user
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });
  //send the success response
  createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  let message = '';
  //verifies if the user inputted an email and a password
  if (!email || !password) {
    if (!email) {
      message += 'please provide an email !. ';
    }
    if (!password) {
      message += 'please provide a password';
    }
    return next(new AppError(message, 400));
  }
  //verifies if the email exists in the database
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError('email not found', 400));

  //verifies if password is correct
  const correct = await user.correctPassword(password, user.password);
  if (!correct) return next(new AppError('password incorrect', 401));

  //if everything is okay send a token
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //verifying if token is sent on headers (user logged in)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError(
        'You need to be logged in in order to access this route',
        401
      )
    );
  }
  //verifying if the token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //verify if the user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("this user doesn't exist", 401));
  }
  //verify if user changed password after token was generated
  if (user.ChangedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('user recently changed password please log in again', 401)
    );
  }
  req.user = user;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new AppError("You don't have permission to do that !", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email adress', 404));
  }
  //generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it back as an email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password ? click this link to reset it \n ${resetURL} \n if you didn't request this change please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset request',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new AppError('Error sending the reset email, please try again', 500)
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on the token
  //if token has not expired and user exists set the new password
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired !', 400));
  }

  //update changedpassword at for the current user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  //log the user in by sending JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //verify if user logged in
  if (!req.user) {
    return next(new AppError('You need to be logged in', 401));
  }
  const user = await User.findById(req.user.id).select('+password');
  //verify old password match
  if (!req.body.oldPassword) {
    return next(new AppError('Please enter your old password', 401));
  }
  if (!req.body.newPassword) {
    return next(new AppError('Please enter your new password', 401));
  }
  if (!req.body.confirmNewPassword) {
    return next(new AppError('Please confirm your new password', 401));
  }
  const correct = await user.correctPassword(
    req.body.oldPassword,
    user.password
  );
  if (!correct) return next(new AppError('password incorrect', 401));
  if (req.body.newPassword !== req.body.confirmNewPassword)
    return next(new AppError("passwords don't match"));
  //update the password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmNewPassword;
  console.log(user);
  await user.save();
  //log user in by sending JWT
  createSendToken(user, 200, res);
});
