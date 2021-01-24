const Joi = require("joi");
const contactModel = require("./contact.model");
const userModel = require("../users/user.model");
const {
  Types: { ObjectId },
} = require("mongoose");
const {
  NotFoundError,
  ValidationError,
} = require("../helpers/errors.constructors");

class ContactController {
  async createContact(req, res, next) {
    try {
      const contact = await contactModel.create({
        ...req.body,
        userId: req.user._id,
      });

      await userModel.findByIdAndUpdate(
        req.user._id,
        { $push: { contacts: { id: contact._id.toString() } } },
        { new: true }
      );

      return res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  async getContacts(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 20;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const skip = page * limit - limit;
      const subQuery = req.query.sub;

      const contacts = await contactModel.find(
        { userId: req.user._id },
        { __v: 0 },
        { skip, limit }
      );

      return res.status(200).json(contacts, skip, limit);
    } catch (err) {
      next(err);
    }
  }

  async getContactById(req, res, next) {
    try {
      const contactId = req.params.id;

      const contact = await contactModel.findById(contactId);

      if (!contact) {
        throw new NotFoundError(`contact with id:${contactId} not found`);
      }

      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  async deleteContactById(req, res, next) {
    try {
      const contactId = req.params.id;

      const deletedContact = await contactModel.findByIdAndDelete(contactId);

      if (!deletedContact) {
        throw new NotFoundError(`contact with id:${contactId} not found`);
      }

      await userModel.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { contacts: { id: contactId } },
        },
        { new: true }
      );

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req, res, next) {
    try {
      const contactId = req.params.id;

      const contactToUpdate = await contactModel.findByIdAndUpdate(
        contactId,
        {
          $set: req.body,
        },
        { new: true }
      );

      if (!contactToUpdate) {
        throw new NotFoundError(`contact with id:${contactId} not found`);
      }

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  validateId(req, res, next) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send();
    }

    next();
  }

  validateCreateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      throw new ValidationError("missing required field");
    }

    next();
  }

  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
    }).min(1);

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      throw new ValidationError("missing required field");
    }

    next();
  }
}

module.exports = new ContactController();
