const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  combinedId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  url: {
    type: [String],
  },
  from: {
    type: String,
    required: true
  }
});

module.exports.MessageSchema = mongoose.model('messages', MessageSchema);
