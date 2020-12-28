const contacts = require("../models/contacts.json");
const Joi = require("joi");

class ContactController {
  listContacts = (req, res) => {
    return res.status(200).json(contacts);
  };

  getById = (req, res) => {
    const contactIndex = this.findContactById(req.params);

    res.json(contacts[contactIndex]);
  };

  addContact = (req, res) => {
    const newContact = {
      ...req.body,
      id: Math.trunc(Math.random() * 1000),
    };

    contacts.push(newContact);
    res.json(newContact);
  };

  validateNewContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ message: "missing required name field" });
    }

    next();
  }

  removeContact = (req, res) => {
    const contactIndex = this.findContactById(req.params);
    const result = contacts.splice(contactIndex, 1);
    return res.json(result);
  };

  updateContact = (req, res) => {
    // if (!req.body) {
    //   return res.status(400).json({ message: "missing fields" });
    // }
    const contactIndex = this.findContactById(req.params);

    const updatedContact = {
      ...contacts[contactIndex],
      ...req.body,
    };

    contacts[contactIndex] = updatedContact;
    return res.json(updatedContact);
  };

  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ message: "missing required name field" });
    }

    next();
  }

  findContactById(params) {
    const { contactId } = params;

    const contactIndex = contacts.findIndex(
      ({ id }) => id === parseInt(contactId)
    );

    if (contactIndex === -1) {
      return res.status(404).json({ message: "Not found" });
    }

    return contactIndex;
  }
}

module.exports = new ContactController();
