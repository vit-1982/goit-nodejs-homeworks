const Joi = require("joi");
const contactModel = require("./contact.model");
const {
  Types: { ObjectId },
} = require("mongoose");

class ContactController {
  async createContact(req, res, next) {
    try {
      const contact = await contactModel.create(req.body);

      return res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  async getContacts(req, res, next) {
    try {
      const contacts = await contactModel.find({});

      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  async getContactById(req, res, next) {
    try {
      const contactId = req.params.id;

      const contact = await contactModel.findById(contactId);

      if (!contact) {
        return res
          .status(404)
          .json({ message: `contact with id:${contactId} not found` });
      }

      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  // async deleteContactById(req, res, next) {
  //   try {
  //     const contactId = req.params.id;

  //     const deletedContact = await contactModel.findByIdAndDelete(contactId);

  //     if (!deletedContact) {
  //       return res
  //         .status(404)
  //         .json({ message: `contact with id:${contactId} not found` });
  //     }

  //     return res.status(204).send();
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  deleteContactById(req, res) {
    const contactId = req.params.id;

    const deletedContact = contactModel.findByIdAndDelete(contactId);

    if (!deletedContact) {
      return res
        .status(404)
        .json({ message: `contact with id:${contactId} not found` });
    }

    return res.status(204).send();
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
        return res
          .status(404)
          .json({ message: `contact with id:${contactId} not found` });
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
      subscription: Joi.string().required(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ message: "missing required name field" });
    }

    next();
  }

  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ message: "missing required name field" });
    }

    next();
  }
}

module.exports = new ContactController();
