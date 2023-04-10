const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    unique: true,
  },
  displayName: {
    type: String,
  },
  email: {
    type: String,
  },
  photoURL: {
    type: String,
  },
});

module.exports.UserSchema = mongoose.model('users', UserSchema);
