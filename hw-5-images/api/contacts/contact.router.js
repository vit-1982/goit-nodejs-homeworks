const { Router } = require("express");
const contactController = require("./contact.controller");
const { authorizeUser } = require("../middlewares/auth.middleware");

const contactRouter = Router();

contactRouter.post(
  "/",
  authorizeUser,
  contactController.validateCreateContact,
  contactController.createContact
);

contactRouter.get("/", authorizeUser, contactController.getContacts);

contactRouter.get(
  "/:id",
  authorizeUser,
  contactController.validateId,
  contactController.getContactById
);

contactRouter.delete(
  "/:id",
  authorizeUser,
  contactController.validateId,
  contactController.deleteContactById
);

contactRouter.put(
  "/:id",
  authorizeUser,
  contactController.validateId,
  contactController.validateUpdateContact,
  contactController.updateContact
);

module.exports = contactRouter;
