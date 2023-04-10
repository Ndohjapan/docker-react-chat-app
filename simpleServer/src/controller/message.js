const { default: mongoose } = require('mongoose');
const DatabaseException = require('../error/DatabaseException');
const NotFoundUserException = require('../error/NotFoundUserException');
const { MessageSchema } = require('../models/Messages');
const UserChatService = require('./userchat');
const UserService = require('./users');

exports.saveMessage = async (uids, text, url, from) => {
  const exists = await UserService.findMultipleUidsInDB([...uids, from]);

  if (!exists) {
    throw new NotFoundUserException('invalid_uid_for_user_chat');
  }

  let combinedId = uids[0] > uids[1] ? uids[0] + uids[1] : uids[1] + uids[0];

  let combinedIds = [combinedId + uids[0], combinedId + uids[1]];

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const message = await MessageSchema.create({
      combinedId,
      text,
      url,
      from,
    });

    await UserChatService.addMessageIdToUserChats(message.id, combinedIds, combinedId+from);

    await session.commitTransaction();

    session.endSession();

    return message;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new DatabaseException('error_in_saving_message');
  }
};

exports.getMessages = async (combinedId, userUid) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let messages = await MessageSchema.find({ combinedId });
    await UserChatService.changeReadStatusToTrue(combinedId+userUid)
    await session.commitTransaction();

    session.endSession();
    return messages
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new DatabaseException('error_in_getting_message');
  }
};
