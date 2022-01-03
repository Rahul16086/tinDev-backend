const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
  remoteAvailability: {
    type: Boolean,
  },
  lookingFor: {
    type: String,
  },
  ageGroup: {
    type: String,
  },
  experienceLevel: {
    type: String,
  },
  matchRadius: {
    type: Number,
  },

  matches: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [{}],
});

module.exports = mongoose.model("User", userSchema);
