const { Schema, model } = require("mongoose");

const PhotoSchema = new Schema({
  photoUrl: {
    type: String,
    required: [true, "Please provide a image url"],
  },
  label: {
    type: String,
    required: [true, "Please provide a label for the image"],
  },
});

module.exports = model("Photo", PhotoSchema);
