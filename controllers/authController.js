const CatchAsync = require("./../utility/catchAsync");
const AppError = require("./../utility/appError");
const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const jwtExpress = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
// must decalre dotenv inorder to sgMail to work
const dotnev = require("dotenv");
dotnev.config({ path: "./config/config.env" });
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = CatchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userEmail = await User.findOne({ email });

  if (userEmail) {
    return next(new AppError(`${email} has been taken.`, 401));
  }

  const token = jwt.sign(
    { name, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: "10m" }
  );

  const emailData = {
    from: process.env.EMAIL_TO,
    to: email,
    subject: `Account activiation link`,
    html: `
            <h1>Please use the following link to acitivate your account</h1>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <hr/>
            <p>This email may contain sensitive information</p>
            <p>${process.env.CLIENT_URL}</p>
        `,
  };
  sgMail.send(emailData).then((sent) => {
    //   console.log("SIGNUP EMAIL SENT", sent)
    return res.json({
      status: "success",
      message: `Email has been sent to ${email}. Follow the instruction to activate your account. `,
    });
  });
});

exports.accountActivation = CatchAsync(async (req, res, next) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
          return next(
            new AppError("Your session has expired. Please signup again.", 401)
          );
        }

        const { name, email, password } = jwt.decode(token);

        const newUser = new User({ name, email, password });
        newUser.save((err, user) => {
          if (err) {
            console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
            return next(
              new AppError(
                "Unable to activate your account. Please try again",
                401
              )
            );
          }
          return res.json({
            status: "success",
            message: " Signed up succesfully! Please sign in!",
            user: newUser,
          });
        });
      }
    );
  }
});

exports.signin = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  await User.findOne({ email })
    .select("+hashed_password")
    .select("+salt")
    .exec((err, user) => {
      if (err || !user) {
        return next(
          new AppError(`${email} does not exist. Please signup.`, 400)
        );
      }

      // authenticate
      if (!user.authenticate(password)) {
        return next(new AppError("Email and password do no match", 400));
      }
      // generate a token and send to client
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const { _id, name, email, role } = user;

      return res.json({
        status: "success",
        token,
        user: { _id, name, email, role },
      });
    });
});

// validate token
// req.user._id
exports.requiredSignIn = jwtExpress({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.admin = CatchAsync(async (req, res, next) => {
  await User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return next(new AppError("User does not exist", 400));
    }

    if (user.role !== "admin") {
      return next(new AppError("Admin resources. Access denied.", 400));
    }
    req.profile = user;
    next();
  });
});

exports.forgotPassword = CatchAsync(async (req, res, next) => {
  const { email } = req.body;

  await User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return next(new AppError("User with that email does not exist.", 400));
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );

    // ${process.env.CLIENT_URL}/auth/password/reset/${token} url MUST match frontend url
    const emailData = {
      from: process.env.EMAIL_TO,
      to: email,
      subject: `Password Reset Link`,
      html: `
              <h1>Please use the following link to reset your password</h1>
              <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
              <hr/>
              <p>This email may contain sensitive information</p>
              <p>${process.env.CLIENT_URL}</p>
          `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log("RESET PASSWORD LINK ERROR", err);
        return next(
          new AppError("Database connection error on user request ", 400)
        );
      } else {
        sgMail.send(emailData).then((sent) => {
          //   console.log("SIGNUP EMAIL SENT", sent)
          return res.json({
            status: "success",
            message: `Email has been sent to ${email}. Follow the instruction to reset your account. `,
          });
        });
      }
    });
  });
});

exports.resetPassword = CatchAsync(async (req, res, next) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return next(new AppError("Expired link. Please try again.", 400));
        }

        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            new AppError("Something went wrong. Please try again.", 400);
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save(
            res.json({
              status: "success",
              message:
                "Your password has been reset successfully! Please login!",
            })
          );
        });
      }
    );
  }
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = CatchAsync(async (req, res, next) => {
  const { idToken } = req.body;

  await client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      // console.log("GOOGLE LOGIN RESPONSE", res)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, role, name } = user;
            return res.json({
              status: "sucess",
              message: "Google user saved",
              token,
              user: { _id, email, role, name },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return next(
                  new AppError("User signup failed with Google", 400)
                );
              }
              const token = jwt.sign(
                { _id: user._id },
                process.env.JWT_SECRET,
                {
                  expiresIn: "7d",
                }
              );
              const { _id, email, role, name } = user;
              return res.json({
                status: "sucess",
                message: "Google user saved",
                token,
                user: { _id, email, role, name },
              });
            });
          }
        });
      } else {
        return next(new AppError("Google login failed. Try again", 400));
      }
    });
});

exports.facebookLogin = CatchAsync(async (req, res, next) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      const { email, name } = response;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          // user already exist on our database
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });
          const { _id, email, role, name } = user;
          return res.json({
            status: "sucess",
            message: "Google user saved",
            token,
            user: { _id, email, role, name },
          });
        } else {
          // signing up for first time
          let password = email + process.env.JWT_SECRET;
          user = new User({ name, email, password });
          user.save((err, data) => {
            if (err) {
              console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
              return next(
                new AppError("User signup failed with Facebook", 400)
              );
            }
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, role, name } = user;
            return res.json({
              status: "sucess",
              message: "Facebook user saved",
              token,
              user: { _id, email, role, name },
            });
          });
        }
      });
    })
    .catch((error) => {
      return next(new AppError("Facebook login failed. Try again", 400));
    });
});
