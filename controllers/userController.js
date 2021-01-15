const User = require("./../models/User");
const CatchAsync = require("./../utility/catchAsync");
const AppError = require("./../utility/appError");

exports.read = CatchAsync(async (req, res, next) => {
  const userId = req.params.id;
  await User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return next(new AppError("Sorry, but this user does not exist.", 400));
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
});

exports.update = CatchAsync(async (req, res, next) => {
  const { name, password } = req.body;

  await User.findOne({ _id: req.user._id }, (err, user) => {
    if (err || !user) {
      return next(new AppError("User does not exist", 400));
    }
    if (!name) {
      return next(new AppError("Name is required", 400));
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return next(
          new AppError("Password must be at least 6 characters.", 400)
        );
      } else {
        user.password = password;
      }
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log("USER UPDATE ERROR", err);
        return res.status(400).json({
          status: "fail",
          error: "User information cannot be updated",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json({
        status: "sucess",
        message: "Profile updated successfully!",
        updatedUser,
      });
    });
  });
});
