const express = require("express");
const ContactController = require("../controllers/contact.controller");

const router = express.Router();

router.get("/", ContactController.listContacts);
router.get("/:contactId", ContactController.getById);
router.post(
  "/",
  ContactController.validateNewContact,
  ContactController.addContact
);
router.delete("/:contactId", ContactController.removeContact);
router.patch(
  "/:contactId",
  ContactController.validateUpdateContact,
  ContactController.updateContact
);

module.exports = router;
