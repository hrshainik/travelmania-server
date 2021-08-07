require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");

process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

const dbUri = process.env.DB_URI.replace("<password>", process.env.DB_PASSWORD);

mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("connected"))
  .catch(err => console.log(err));

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
