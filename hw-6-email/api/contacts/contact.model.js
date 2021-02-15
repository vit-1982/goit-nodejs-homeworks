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
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const contactModel = mongoose.model("Contact", contactSchema);

module.exports = contactModel;
