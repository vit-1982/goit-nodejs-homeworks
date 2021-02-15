const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const Avatar = require("avatar-builder");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");
const userModel = require("../users/user.model");
const {
  UnauthorizedError,
  ConflictError,
  ValidationError,
  NotFoundError,
} = require("../helpers/errors.constructors");

class AuthController {
  register = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const userExist = await userModel.findOne({ email });
      if (userExist) {
        throw new ConflictError("Email in use");
      }

      const avatar = Avatar.male8bitBuilder(128);

      avatar
        .create(email)
        .then((buffer) =>
          fs.writeFileSync(`public/images/avatar-${email}.png`, buffer)
        );

      const user = await userModel.create({
        ...req.body,
        password: await bcrypt.hash(password, 10),
        avatarURL: `http://localhost:${process.env.PORT}/images/avatar-${email}.png`,
      });

      await this.sendVerificationEmail(user);

      return res
        .status(201)
        .json({ message: "successfully registered", email, password });
    } catch (err) {
      next(err);
    }
  };

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email });

      if (!user || user.status !== "Verified") {
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

  async verifyEmail(req, res, next) {
    try {
      const { verificationToken } = req.params;

      const userToVerify = await userModel.findOne({ verificationToken });
      if (!userToVerify) {
        throw new NotFoundError("User not found");
      }

      await userModel.verifyUser(userToVerify._id);

      return res.status(200).send("User is successfully verified");
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

  async sendVerificationEmail(user) {
    const verificationToken = uuidv4();

    await userModel.createVerificationToken(user._id, verificationToken);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: user.email,
      from: process.env.SENDER_EMAIL,
      subject: "Verify your email",
      html: `<strong>You can verify your email by clicking <a href="http://localhost:${process.env.PORT}/api/auth/verify/${verificationToken}">this link</a></strong>`,
    };

    await sgMail.send(msg);
  }
}

module.exports = new AuthController();
