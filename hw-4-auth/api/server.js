const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./auth/auth.router");
const userRouter = require("./users/user.router");
const contactRouter = require("./contacts/contact.router");
require("dotenv").config();

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    // this.listen();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    // this.server.use((error, req, res, next) => {
    //   res.status(500).json({ message: error.message });
    // });
  }

  initRoutes() {
    this.server.use("/api/users", userRouter);
    this.server.use("/api/users/current/contacts", contactRouter);
    this.server.use("/api/auth", authRouter);
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });

      this.listen();
    } catch (err) {
      console.log("Start up error: ", err);
    }
  }

  listen() {
    const PORT = process.env.PORT;
    this.server.listen(PORT, () => {
      console.log("Server is listening on port: ", PORT);
    });
  }
};
