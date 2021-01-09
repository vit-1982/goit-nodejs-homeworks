const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    validate: (value) => value.includes("@"),
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
  },
  password: {
    type: String,
    default: "password",
  },
  token: {
    type: String,
    default: "",
  },
});

const contactModel = mongoose.model("Contact", contactSchema);

module.exports = contactModel;
