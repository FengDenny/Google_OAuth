const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

// to catch exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXEPTION");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config/config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log(`Connected to MongoDB: ${process.env.DATABASE} successfully!`)
  );

const port = process.env.PORT || 3001;
app.listen(port, console.log(`App is running on port ${port}`));

// to catch rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
