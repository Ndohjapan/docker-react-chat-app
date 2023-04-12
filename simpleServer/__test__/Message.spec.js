const app = require('../src/app');
const request = require('supertest');
const { UserSchema } = require('../src/models/User');
const en = require('../locale/en/translation');
const mongoose = require('mongoose');
const { UserChatSchema } = require('../src/models/UserChat');
const { MessageSchema } = require('../src/models/Messages');
const test = require('../config/test');
const dbConfig = test.database

let user1 = {
  displayName: 'Ndohjapan',
  email: 'ndohjoelmbj16@gmail.com',
  photoURL: 'Chibueze17',
  uid: '32ri329j9032uifm32',
};

let user2 = {
  displayName: 'Voldermort',
  email: 'ndohjoel2018@gmail.com',
  photoURL: 'Chibueze17',
  uid: 'fneinrih38rh3n2i',
};

let combinedId =
  user1.uid > user2.uid ? user1.uid + user2.uid : user2.uid + user1.uid;

beforeEach(async () => {
  await mongoose.connect(dbConfig.url+'/test5', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (error) {
    return true;
  }
});

const createUserandUserChat = async () => {
  await UserSchema.create(user1);
  await UserSchema.create(user2);
  await UserChatSchema.create({ userUid: user1.uid });
  await UserChatSchema.create({ userUid: user2.uid });
  return true;
};

const addUserToChat = async (body = { uids: [user1.uid, user2.uid] }) => {
  return await request(app).post('/userChat').send(body);
};

const getMessages = async (combinedId, user = user1.uid) => {
  return request(app).get(`/message/${combinedId}/${user}`).send();
};

const createMessage = async (combinedId, text, url = [], from = user1.uid) => {
  return request(app).post('/message').send({ combinedId, text, url, from });
};

describe('creating a message', () => {
  it('Confirm that the users are created appropriately', async () => {
    await createUserandUserChat();
    await addUserToChat();
    let userChat = await UserChatSchema.find({});
    let users = await UserSchema.find({});

    expect(users.length).toBe(2);
    expect(userChat.length).toBe(2);
    expect(userChat[0].chats.length).toBe(1);
    expect(userChat[1].chats.length).toBe(1);
    expect(userChat[0].chats[0].userInfo.uid).toBe(user2.uid);
    expect(userChat[1].chats[0].userInfo.uid).toBe(user1.uid);
  });

  it.each`
    combinedId                | message
    ${null}                   | ${en.invalid_body_format}
    ${'hello'}                | ${en.invalid_body_format}
    ${['']}                   | ${en.invalid_body_length}
    ${['u4i3', 'ene', 'fje']} | ${en.invalid_body_length}
    ${['u4i3']}               | ${en.invalid_body_length}
    ${['u413', 'u413']}       | ${en.cannot_send_message_to_self}
  `(
    'returns 400 if the combined id is $combinedId when sent to the server',
    async ({ combinedId, message }) => {
      const response = await createMessage(combinedId, 'efneninreu');

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.combinedId).toBe(message);
    }
  );

  it.each`
    text                      | message
    ${1234}                   | ${en.invalid_body_format}
    ${['']}                   | ${en.invalid_body_format}
    ${['u4i3', 'ene', 'fje']} | ${en.invalid_body_format}
    ${['u4i3']}               | ${en.invalid_body_format}
  `(
    'returns 400 if the text is $text when sent to the server',
    async ({ text, message }) => {
      const response = await createMessage([user1.uid, user2.uid], text);

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.text).toBe(message);
    }
  );

  it.each`
    url                       | message
    ${1234}                   | ${en.invalid_body_format}
    ${['']}                   | ${en.invalid_url_format}
    ${['u4i3', 'ene', 'fje']} | ${en.invalid_url_format}
    ${['u4i3']}               | ${en.invalid_url_format}
  `(
    'returns 400 if the url is $url when sent to the server',
    async ({ url, message }) => {
      const response = await createMessage([user1.uid, user2.uid], 'wfew', url);

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.url).toBe(message);
    }
  );

  it.each`
    url
    ${['https://jreinreiner', 'http://wwiwi']}
    ${['https://rei.com', 'https://diwn.com']}
    ${['http://hll.com', 'http://worlc.com']}
    ${['https://hellow.com']}
    ${['http://hellow.com']}
  `(
    'returns 200 ok if the url is $url when sent to the server',
    async ({ url }) => {
      await createUserandUserChat();
      await addUserToChat();
      const response = await createMessage([user1.uid, user2.uid], 'wfew', url);

      expect(response.status).toBe(200);
    }
  );

  it('return 404 if the combined ids are not in the database', async () => {
    const response = await createMessage(
      ['wehbfeubuww', 'feufuwenufw'],
      'euwuwue'
    );

    expect(response.status).toBe(404);
  });

  it('returns 404 error message when the combined id are not in the database', async () => {
    const response = await createMessage(['iweniwn', 'hvreine'], 'fewine');
    expect(response.body.message).toBe(en.invalid_uid_for_user_chat);
  });

  it('return 404 if the from id is not in the database', async () => {
    const response = await createMessage(
      [user2.uid, user1.uid],
      'euwuwue',
      [],
      'fbewbfiew'
    );

    expect(response.status).toBe(404);
  });

  it('returns 404 error message when the from id are not in the database', async () => {
    const response = await createMessage(
      [user2.uid, user1.uid],
      'fewine',
      [],
      'jeiwiew'
    );
    expect(response.body.message).toBe(en.invalid_uid_for_user_chat);
  });

  it('returns 200 if the message was saved successfully', async () => {
    await createUserandUserChat();
    await addUserToChat();
    const response = await createMessage([user1.uid, user2.uid], 'fewine');

    expect(response.status).toBe(200);
  });

  it('confirm the message was actually created', async () => {
    await createUserandUserChat();
    const response = await createMessage([user1.uid, user2.uid], 'fewine');

    const messageInDB = await MessageSchema.find({});

    expect(response.status).toBe(200);
    expect(messageInDB[0].text).toBe('fewine');
    expect(messageInDB[0].combinedId).toBe(combinedId);
  });

  it('confirm the message was added as last message to the user chat of both users', async () => {
    await createUserandUserChat();
    await addUserToChat();
    await createMessage([user1.uid, user2.uid], 'fewine');

    const messageInDB = await MessageSchema.find({});

    const userChatInDB = await UserChatSchema.find({});

    expect(userChatInDB[0].chats[0].lastMessage.id).toBe(messageInDB[0].id);
    expect(userChatInDB[0].chats[0].lastMessage.text).toBe(messageInDB[0].text);
    expect(userChatInDB[1].chats[0].lastMessage.id).toBe(messageInDB[0].id);
    expect(userChatInDB[1].chats[0].lastMessage.text).toBe(messageInDB[0].text);
  });

  it('confirm that the creator of the message has read the message immediately the message is creator while the recievers have their readLastMessage value as false', async () => {
    await createUserandUserChat();
    await addUserToChat();
    await createMessage([user1.uid, user2.uid], 'fewine', [], user1.uid);

    const user1ChatInDB = await UserChatSchema.find({ userUid: user1.uid });
    const user2ChatInDB = await UserChatSchema.find({ userUid: user2.uid });

    expect(user1ChatInDB[0].chats[0].readLastMessage).toBeTruthy();
    expect(user2ChatInDB[0].chats[0].readLastMessage).toBeFalsy();
  });
});

describe('getting messages', () => {
  it('returns 200 ok when it returns message', async () => {
    await createUserandUserChat();
    await createMessage(combinedId, 'fjinwnwe', ['https://helloword.com']);
    const response = await getMessages(combinedId);

    expect(response.status).toBe(200);
  });

  it('returns the  messages', async () => {
    await createUserandUserChat();
    await createMessage(combinedId, 'ueiwnw');

    const response = await getMessages(combinedId);

    expect(Array.isArray(response.body.messages)).toBe(true);
  });

  it('check if it will readLastMessage status of the use who is recieving the message to false while the one who made the request is still true ', async () => {
    await createUserandUserChat();
    await addUserToChat();
    await createMessage([user1.uid, user2.uid], 'fewine', [], user1.uid);

    await getMessages(combinedId);

    const user1ChatInDB = await UserChatSchema.find({ userUid: user1.uid });
    const user2ChatInDB = await UserChatSchema.find({ userUid: user2.uid });

    expect(user1ChatInDB[0].chats[0].readLastMessage).toBeTruthy();
    expect(user2ChatInDB[0].chats[0].readLastMessage).toBeFalsy();
  });

  it('check if it will readLastMessage status of the use who is recieving the message to true ', async () => {
    await createUserandUserChat();
    await addUserToChat();
    await createMessage([user1.uid, user2.uid], 'fewine', [], user1.uid);

    await getMessages(combinedId, user2.uid);

    const user1ChatInDB = await UserChatSchema.find({ userUid: user1.uid });
    const user2ChatInDB = await UserChatSchema.find({ userUid: user2.uid });

    expect(user1ChatInDB[0].chats[0].readLastMessage).toBeTruthy();
    expect(user2ChatInDB[0].chats[0].readLastMessage).toBeTruthy();
  });
});
