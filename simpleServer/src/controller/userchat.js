const { default: mongoose } = require('mongoose');
const NotFoundUserException = require('../error/NotFoundUserException');
const { UserSchema } = require('../models/User');
const { UserChatSchema, ConnectionSchema } = require('../models/UserChat');
const UserService = require('./users');

exports.createUserChat = async (uid) => {
  let exists = await UserService.findSingleUidinDB(uid);
  if (!exists) {
    throw new NotFoundUserException('invalid_uid_for_user_chat');
  }

  let data = { userUid: uid, chats: [] };

  try {
    await UserChatSchema.create(data);
  } catch (error) {
    throw new Error(error.message);
  }

  return true;
};

exports.addUserToChat = async (uids) => {
  let exists = await UserService.findMultipleUidsInDB(uids);
  if (!exists) {
    throw new NotFoundUserException('invalid_uid_for_user_chat');
  }

  let user1 = await UserSchema.findOne({ uid: uids[0] });
  let user2 = await UserSchema.findOne({ uid: uids[1] });

  let combinedId =
    user1.uid > user2.uid ? user1.uid + user2.uid : user2.uid + user1.uid;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let connection1 = await ConnectionSchema.create({
      combinedId: combinedId + user1.uid,
      userInfo: user2._id,
    });

    let connection2 = await ConnectionSchema.create({
      combinedId: combinedId + user2.uid,
      userInfo: user1._id,
    });

    await UserChatSchema.findOneAndUpdate(
      { userUid: user1.uid },
      { $addToSet: { chats: connection1._id } }
    );

    await UserChatSchema.findOneAndUpdate(
      { userUid: user2.uid },
      { $addToSet: { chats: connection2._id } }
    );

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return true;
  }
};

exports.getUserChat = async (userUid) => {
  let userChat = await UserChatSchema.find({ userUid });

  if (!userChat.length) {
    throw new NotFoundUserException('invalid_uid_for_user_chat');
  }

  return userChat[0];
};

exports.addMessageIdToUserChats = async (messageId, combinedIds, from) => {
  const latestDate = new Date().toISOString();
  const filter = {
    combinedId: { $in: combinedIds },
  };
  try {
    await ConnectionSchema.updateMany(filter, {
      $set: {
        lastMessage: messageId,
        date: latestDate,
        readLastMessage: false,
      },
    });

    await ConnectionSchema.updateOne(
      { combinedId: from },
      {
        $set: {
          readLastMessage: true,
        },
      }
    );
    return true;
  } catch (error) {
    throw new Error('error_in_updating_user_chat');
  }
};

exports.changeReadStatusToTrue = async (combinedId) => {
  try {
    await ConnectionSchema.updateOne(
      { combinedId: combinedId },
      {
        $set: {
          readLastMessage: true,
        },
      }
    );
    
  } catch (error) {
    throw new Error('error_in_updating_user_chat');
  }
};
