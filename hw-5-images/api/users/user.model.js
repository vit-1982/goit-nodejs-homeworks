const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: (value) => value.includes("@"),
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  avatarURL: {
    type: String,
  },
  token: {
    type: String,
    required: false,
  },
  contacts: {
    type: Array,
  },
});

userSchema.statics.updateToken = updateToken;

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, {
    token: newToken,
  });
}

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
