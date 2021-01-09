const express = require("express");
// const mongodb = require("mongodb");
const { MongoClient, ObjectID } = require("mongodb");
const Joi = require("joi");
const PORT = 3030;
const MONGODB_URL =
  "mongodb+srv://admin:kAqx4g15rC0ZsZ94@cluster0.wbp2z.mongodb.net/test";
const DB_NAME = "db-contacts";

let db, contactsCollection;

async function main() {
  const server = express();

  const client = await MongoClient.connect(MONGODB_URL);
  db = client.db(DB_NAME);
  contactsCollection = db.collection("contacts");

  server.use(express.json());

  server.post("/api/contacts", validateCreateContact, createContact);
  server.get("/api/contacts", getContacts);
  server.get("/api/contacts/:id", getContactById);
  server.delete("/api/contacts/:id", deleteContactById);
  server.put("/api/contacts/:id", validateUpdateContact, updateContact);

  server.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
  });
}

function validateCreateContact(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().required(),
    // email: Joi.string().required(),
    // phone: Joi.string().required(),
    // subscription: Joi.string().required(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

function validateUpdateContact(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string(),
    // email: Joi.string().required(),
    // phone: Joi.string().required(),
    // subscription: Joi.string().required(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

async function createContact(req, res, next) {
  try {
    const newContact = await contactsCollection.insert(req.body);

    return res.status(201).json(newContact.ops);
  } catch (err) {
    next(err);
  }
}

async function getContacts(req, res, next) {
  try {
    const contacts = await contactsCollection.find({}).toArray();

    return res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
}

async function getContactById(req, res, next) {
  try {
    const contactId = req.params.id;

    if (!ObjectID.isValid(contactId)) {
      return res.status(404).send();
    }

    const contact = await contactsCollection.findOne({
      _id: new ObjectID(contactId),
    });

    if (!contact) {
      return res.status(404).send();
    }

    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

async function deleteContactById(req, res, next) {
  try {
    const contactId = req.params.id;

    if (!ObjectID.isValid(contactId)) {
      return res.status(404).send();
    }

    const deleteResult = await contactsCollection.deleteOne({
      _id: new ObjectID(contactId),
    });

    if (!deleteResult.deletedCount) {
      return res.status(404).send();
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function updateContact(req, res, next) {
  try {
    const contactId = req.params.id;

    if (!ObjectID.isValid(contactId)) {
      return res.status(404).send();
    }

    const updateResult = await contactsCollection.updateOne(
      {
        _id: new ObjectID(contactId),
      },
      { $set: req.body }
    );

    // console.log(updateResult);

    if (!updateResult.modifiedCount) {
      return res.status(404).send();
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

main();
