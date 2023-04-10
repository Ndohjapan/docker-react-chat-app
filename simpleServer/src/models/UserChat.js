const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const { MessageSchema } = require('./Messages');

const connectionSchema = new mongoose.Schema({
  combinedId: {
    type: String,
    unique: true,
    required: true,
  },
  userInfo: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  lastMessage: {
    type: mongoose.Types.ObjectId,
    ref: 'messages',
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  readLastMessage: {
    type: Boolean,
    default: true,
  },
});

const UserChatSchema = new mongoose.Schema({
  userUid: {
    type: String,
    unique: true,
    required: true,
  },
  chats: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'connections',
    },
  ],
});

UserChatSchema.pre('find', function (next) {
  this.populate({
    path: 'chats',
    populate: {
      path: 'userInfo lastMessage',
    },
  });
  next();
});

exports.UserChatSchema = mongoose.model('userchats', UserChatSchema);
exports.ConnectionSchema = mongoose.model('connections', connectionSchema);
