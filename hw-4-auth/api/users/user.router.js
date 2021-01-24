const { Router } = require("express");
const userController = require("./user.controller");
const { authorizeUser } = require("../middlewares/auth.middleware");

const userRouter = Router();

userRouter.get("/current", authorizeUser, userController.getUser);

userRouter.delete(
  "/:id",
  authorizeUser,
  userController.validateId,
  userController.deleteUserById
);

userRouter.put(
  "/:id",
  authorizeUser,
  userController.validateId,
  userController.validateUpdateUser,
  userController.updateUser
);

module.exports = userRouter;
