const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const contactRouter = require("./contacts/contact.router");

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
  }

  initRoutes() {
    this.server.use("/api/contacts", contactRouter);
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
