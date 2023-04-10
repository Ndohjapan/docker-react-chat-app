const DatabaseException = require('../error/DatabaseException');
const { UserSchema } = require('../models/User');
const userChatService = require('./userchat');
const mongoose = require('mongoose');

exports.save = async (body) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await UserSchema.create(body);

    await userChatService.createUserChat(body.uid);

    await session.commitTransaction();

    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new DatabaseException();
  }
};

exports.findSingleUidinDB = async (uid) => {
  let exists = await UserSchema.exists({ uid });

  if (!exists) {
    return false;
  }

  return true;
};

exports.findMultipleUidsInDB = async (uids) => {
  let exists = true;
  for (let i = 0; i < uids.length; i++) {
    exists = await UserSchema.exists({ uid: uids[i] });

    if (!exists) {
      return false;
    }
  }

  return exists;
};
