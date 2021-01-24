const Joi = require("joi");
const jwt = require("jsonwebtoken");
const userModel = require("./user.model");
const {
  NotFoundError,
  ValidationError,
} = require("../helpers/errors.constructors");
const {
  Types: { ObjectId },
} = require("mongoose");

class UserController {
  async getUser(req, res, next) {
    try {
      const userId = await jwt.verify(req.token, process.env.JWT_SECRET).id;

      const user = await userModel.findById(userId);

      if (!user) {
        throw new NotFoundError(`user with id:${userId} not found`);
      }

      return res
        .status(200)
        .json({ user: { email: user.email, subscription: user.subscription } });
    } catch (err) {
      next(err);
    }
  }

  async deleteUserById(req, res, next) {
    try {
      const userId = req.params.id;

      const deletedUser = await userModel.findByIdAndDelete(userId);

      if (!deletedUser) {
        throw new NotFoundError(`user with id:${userId} not found`);
      }

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;

      const userToUpdate = await userModel.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
        },
        { new: true }
      );

      if (!userToUpdate) {
        throw new NotFoundError(`user with id:${userId} not found`);
      }

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  validateId(req, res, next) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      throw new ValidationError();
    }

    next();
  }

  validateUpdateUser(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string().valid("free", "pro", "premium"),
    }).min(1);

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      throw new ValidationError("missing required field");
    }

    next();
  }
}

module.exports = new UserController();
