const express = require("express");
const cors = require("cors");
const contactRoutes = require("./api/routes/contact.routes");

const PORT = 3030;

class Server {
  constructor() {
    this.server = null;
  }

  start() {
    this.server = express();
    this.initMiddlewares();
    this.initRoutes();
    this.listen();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  initRoutes() {
    this.server.use("/api/contacts", contactRoutes);
  }

  listen() {
    this.server.listen(PORT, () => {
      console.log("Server is listening on port: ", PORT);
    });
  }
}

const server = new Server();
server.start();
