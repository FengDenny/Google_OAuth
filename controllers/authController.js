const CatchAsync = require("./../utility/catchAsync");
const AppError = require("./../utility/appError");
const User = require("./../models/User");
const jwt = require("jsonwebtoken");
// must decalre dotenv inorder to sgMail to work
const dotnev = require("dotenv");
dotnev.config({ path: "./config/config.env" });
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = CatchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userEmail = await User.findOne({ email });

  if (userEmail) {
    return next(
      new AppError(
        `${email} has been taken. Please signup with another email!`,
        401
      )
    );
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
        token,
        user: { _id, name, email, role },
      });
    });
});
