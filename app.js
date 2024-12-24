// importing
const express = require("express");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");

// rout hand
const userSignUp = require("./users/user.router");
const authRouter = require("./authentication/auth.router");
const todoTask = require("./todoTask/task.router");
const todoItem = require("./todoTaskItems/taskList.router");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});
app.use("/todoTaskItem", todoItem);
app.use("/todoTask", todoTask);
app.use("/auth", authRouter);
app.use("/user", userSignUp);

dotEnv.config({ path: "./config.env" });

mongoose
  .connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"));

const port = process.env.PORT;
app.listen(port, () => console.log(`Server Start & port:${port}`));
