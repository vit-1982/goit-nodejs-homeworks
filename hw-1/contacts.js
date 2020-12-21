const fs = require("fs");
const { promises: fsPromises } = fs;
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

// TODO: задокументировать каждую функцию
async function listContacts() {
  //   try {
  const data = await fsPromises.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
}

// listContacts();

async function getContactById(contactId) {
  //   try {
  const contacts = await listContacts();
  const contactById = contacts.find((contact) => contact.id === contactId);

  return contactById;
  // ? console.log(contactById)
  // : console.log(`There is no contact with id - ${contactId}`);
  //   } catch (error) {
  //     console.log(error);
  //   }
}

// getContactById(0.44729310062899263);

async function removeContact(contactId) {
  const contacts = await listContacts();
  const contactIdExist = contacts.find((contact) => contact.id === contactId);
  if (contactIdExist) {
    const newContacts = contacts.filter((contact) => contact.id !== contactId);
    console.log("Contact is removed successfully!");
    await fsPromises.writeFile(contactsPath, JSON.stringify(newContacts));
  } else {
    console.log(`There is no contact with id - ${contactId}`);
  }
}

// removeContact(0);

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: Math.trunc(Math.random() * 100),
    name: name,
    email: email,
    phone: phone,
  };
  const contactExist = contacts.find((contact) => contact.name === name);

  if (contactExist) {
    console.log("This contsct already exist!");
    return;
  } else {
    const newContacts = [...contacts, newContact];
    console.log("Contact is added successfully!");
    await fsPromises.writeFile(contactsPath, JSON.stringify(newContacts));
  }
}

// addContact("mambo", "mambo@mail.com", "55555555");

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
