const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const userController = require("./user.controller");
const { authorizeUser } = require("../middlewares/auth.middleware");
const { minifyImage } = require("../middlewares/minifyImage.middleware");
const storage = multer.diskStorage({
  destination: "tmp",
  filename: (req, file, cb) => {
    const ext = path.parse(file.originalname).ext;
    const filename = path.parse(file.originalname).name;
    cb(null, filename + "_" + Date.now() + ext);
  },
});
const upload = multer({ storage });

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
  userController.updateUserById
);

userRouter.patch(
  "/avatars",
  authorizeUser,
  upload.single("file"),
  minifyImage,
  userController.validateUpdateUser,
  userController.updateUser
);

module.exports = userRouter;
