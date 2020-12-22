const yargs = require("yargs");
const contacts = require("./contacts");

const argv = yargs
  .string("action")
  .number("id")
  .string("name")
  .string("email")
  .string("phone")
  .alias("action", "a")
  .alias("name", "n")
  .alias("email", "e")
  .alias("phone", "p").argv;

// TODO: рефакторить
function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      contacts
        .listContacts()
        .then((data) => console.table(data))
        .catch((error) => console.log(error));
      // ...
      break;

    case "get":
      contacts
        .getContactById(id)
        .then((contact) =>
          contact
            ? console.log(contact)
            : console.log(`There is no contact with id - ${id}`)
        )
        .catch((error) => console.log(error));
      break;

    case "add":
      contacts
        .addContact(name, email, phone)
        .catch((error) => console.log(error));
      break;

    case "remove":
      contacts.removeContact(id).catch((error) => console.log(error));
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
