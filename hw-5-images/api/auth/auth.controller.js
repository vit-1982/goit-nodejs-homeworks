const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { AvatarGenerator } = require("random-avatar-generator");
const userModel = require("../users/user.model");
const {
  UnauthorizedError,
  ConflictError,
  ValidationError,
} = require("../helpers/errors.constructors");

const generator = new AvatarGenerator();

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;

      const userExist = await userModel.findOne({ email });
      if (userExist) {
        throw new ConflictError("Email in use");
      }

      await userModel.create({
        ...req.body,
        password: await bcrypt.hash(password, 10),
        avatarURL: generator.generateRandomAvatar(),
      });

      return res
        .status(201)
        .json({ message: "successfully registered", email, password });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email });

      if (!user) {
        throw new UnauthorizedError("Email or password is wrong");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedError("Email or password is wrong");
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2 days",
      });
      await userModel.updateToken(user._id, token);

      return res.status(200).json({
        message: "Successfully authorized",
        token,
        user: {
          email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;

      await userModel.updateToken(user._id, null);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  validateRegisterUser(req, res, next) {
    const registrationRules = Joi.object({
      password: Joi.string().required(),
      email: Joi.string().required(),
      subscription: Joi.string(),
    });

    const validationResult = registrationRules.validate(req.body);

    if (validationResult.error) {
      throw new ValidationError(
        "Ошибка от Joi или другой валидационной библиотеки"
      );
    }

    next();
  }

  validateLoginUser(req, res, next) {
    const loginRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = loginRules.validate(req.body);

    if (validationResult.error) {
      throw new ValidationError(
        "Ошибка от Joi или другой валидационной библиотеки"
      );
    }

    next();
  }
}

module.exports = new AuthController();
