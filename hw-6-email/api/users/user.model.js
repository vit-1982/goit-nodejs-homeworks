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
  status: {
    type: String,
    required: true,
    emun: ["Verified", "Created"],
    default: "Created",
  },
  verificationToken: {
    type: String,
    required: false,
  },
  contacts: {
    type: Array,
  },
});

userSchema.statics.updateToken = updateToken;
userSchema.statics.createVerificationToken = createVerificationToken;
userSchema.statics.verifyUser = verifyUser;

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, {
    token: newToken,
  });
}

async function createVerificationToken(userId, verificationToken) {
  return this.findByIdAndUpdate(
    userId,
    {
      verificationToken,
    },
    {
      new: true,
    }
  );
}

async function verifyUser(userId) {
  return this.findByIdAndUpdate(
    userId,
    {
      status: "Verified",
      verificationToken: null,
    },
    {
      new: true,
    }
  );
}

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
