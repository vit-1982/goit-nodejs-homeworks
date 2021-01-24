const { Router } = require("express");
const authController = require("./auth.controller");
const { authorizeUser } = require("../middlewares/auth.middleware");

const authRouter = Router();

authRouter.post(
  "/register",
  authController.validateRegisterUser,
  authController.register
);
authRouter.post(
  "/login",
  authController.validateLoginUser,
  authController.login
);
authRouter.patch("/logout", authorizeUser, authController.logout);

module.exports = authRouter;
