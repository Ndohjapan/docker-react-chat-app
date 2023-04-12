const request = require('supertest');
const app = require('../src/app');
const { UserSchema } = require('../src/models/User');
const en = require('../locale/en/translation');
const { UserChatSchema, ConnectionSchema } = require('../src/models/UserChat');
const mongoose = require('mongoose');
const test = require('../config/test');
const dbConfig = test.database

let validUsers;
let combinedId;
let user3;

beforeEach(async () => {
  await mongoose.connect(dbConfig.url+'/test2', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  validUsers = [
    {
      displayName: 'Ndohjapan',
      email: 'ndohjoelmbj16@gmail.com',
      photoURL: 'Chibueze17',
      uid: '32ri329j9032uifm32',
    },
    {
      displayName: 'Ndohjapan2',
      email: 'ndohjoel2018@gmail.com',
      photoURL: 'Chibueze17',
      uid: 'hSkDdaXIe3al2EtDHAsLcz',
    },
  ];
  combinedId =
    validUsers[0].uid > validUsers[1].uid
      ? validUsers[0].uid + validUsers[1].uid
      : validUsers[1].uid + validUsers[0].uid;

  user3 = {
    displayName: 'Ndohjapan3',
    email: 'ndohjoelmbj16@gmail.com',
    photoURL: 'Chibueze17',
    uid: '32ri329j9032u29y32ne',
  };
});

afterEach(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    // await mongoServer.stop();
  } catch (error) {
    return true;
  }
});

const addUserToChat = async (
  body = { uids: [validUsers[0].uid, validUsers[1].uid] }
) => {
  return await request(app).post('/userChat').send(body);
};

const createUserandUserChat = async (users = validUsers) => {
  await UserSchema.create(users);

  for (let i = 0; i < users.length; i++) {
    await UserChatSchema.create({ userUid: users[i].uid });
  }
  return true;
};

describe('Create the User Chat Between Two Users', () => {
  it('returns 400 if there is no array of uid sent to the server', async () => {
    await createUserandUserChat();
    const response = await addUserToChat('');
    expect(response.status).toBe(400);
  });

  it('returns Invalid body format if there is no array of uid sent to the server', async () => {
    await createUserandUserChat();
    const response = await addUserToChat('');
    expect(response.body.validationErrors.uids).toBe(en.invalid_body_format);
  });

  it('returns Invalid body format if another field that is not uids is send', async () => {
    await createUserandUserChat();
    const response = await addUserToChat({ field: ['hello'] });
    expect(response.body.validationErrors.uids).toBe(en.invalid_body_format);
  });

  it.each`
    array                             | message
    ${['cjreir']}                     | ${en.invalid_body_length}
    ${['cjreir', 'iejwenw', 'wiwiw']} | ${en.invalid_body_length}
  `(
    'returns $message when $array lenght is not 2',
    async ({ array, message }) => {
      await createUserandUserChat();
      const response = await addUserToChat({ uids: array });
      expect(response.body.validationErrors.uids).toBe(message);
    }
  );

  it('returns 404 if the uid sent are not found in the database', async () => {
    await createUserandUserChat();
    const response = await addUserToChat({ uids: ['fnin232', 'in3r32nn23'] });
    expect(response.status).toBe(404);
  });

  it('returns message: "invalid uid" whern the uid are not found in the database in order to create the user chat', async () => {
    await createUserandUserChat();
    const response = await addUserToChat({ uids: ['fnin232', 'in3r32nn23'] });
    expect(response.body.message).toBe(en.invalid_uid_for_user_chat);
  });

  it('returns 200 when the userchat is finally created', async () => {
    await createUserandUserChat();
    const response = await addUserToChat();
    expect(response.status).toBe(200);
  });

  it('returns message: Chat successfully initiated when the userchat is finally created', async () => {
    await createUserandUserChat();
    const response = await addUserToChat();
    expect(response.body.message).toBe(en.chat_successfully_initiated);
  });

  it('cehck if the userchat has an array field called chats', async () => {
    await createUserandUserChat();
    await addUserToChat();
    const userChatInDB = await UserChatSchema.find();

    expect(userChatInDB.length).toBe(2);
    expect(userChatInDB[0].chats).toBeTruthy();
    expect(userChatInDB[1].chats).toBeTruthy();
  });

  it('check if the field called chat is actually has a length of 1', async () => {
    await createUserandUserChat();
    await addUserToChat();
    const userChatInDB = await UserChatSchema.find();

    expect(userChatInDB[0].chats.length).toBe(1);
    expect(userChatInDB[1].chats.length).toBe(1);
  });

  it('check if the chat field has a field called combinedId and it the combinedId of the both users', async () => {
    await createUserandUserChat();
    await addUserToChat();
    const userChatInDB = await UserChatSchema.find();

    expect(userChatInDB[0].chats[0].combinedId).toBe(
      combinedId + validUsers[0].uid
    );
    expect(userChatInDB[1].chats[0].combinedId).toBe(
      combinedId + validUsers[1].uid
    );
  });

  it('check if the user info field of the chats array is the actual uid of the second user', async () => {
    await createUserandUserChat();
    await addUserToChat();
    const userChatInDB = await UserChatSchema.find();

    expect(userChatInDB[0].chats[0].userInfo.uid).toBe(validUsers[1].uid);
    expect(userChatInDB[1].chats[0].userInfo.uid).toBe(validUsers[0].uid);
  });

  it('checks if the userchat has already been created and does not duplicate it in database', async () => {
    await createUserandUserChat();
    await addUserToChat();
    await addUserToChat();
    const userChatInDB = await UserChatSchema.find();

    expect(userChatInDB.length).toBe(2);
  });

  it('return 200 when we try to duplicate data and the data will still hold only the main one', async () => {
    await createUserandUserChat();
    await addUserToChat();
    const response = await addUserToChat();

    const connectionsInDB = await ConnectionSchema.find();
    const userChatInDB = await UserChatSchema.find();
    expect(response.status).toBe(200);
    expect(connectionsInDB.length).toBe(2);
    expect(userChatInDB.length).toBe(2);
    expect(userChatInDB[0].chats.length).toBe(1);
    expect(userChatInDB[1].chats.length).toBe(1);
    expect(userChatInDB[0].chats[0].userInfo.uid).toBe(validUsers[1].uid);
    expect(userChatInDB[1].chats[0].userInfo.uid).toBe(validUsers[0].uid);
  });

  it('return 200 when we want to establish another chat connection to first user and thirs user', async () => {
    await createUserandUserChat();
    await createUserandUserChat([user3]);
    await addUserToChat();
    const response = await addUserToChat({
      uids: [user3.uid, validUsers[0].uid],
    });
    expect(response.status).toBe(200);
  });

  it('check if the number of chat connections of user 1 is now 2 while that of user 2 and user 3 are still 1', async () => {
    await createUserandUserChat();
    await createUserandUserChat([user3]);
    await addUserToChat();
    await addUserToChat({
      uids: [user3.uid, validUsers[0].uid],
    });

    const user1ChatInDB = await UserChatSchema.findOne({
      userUid: validUsers[0].uid,
    });

    const user2ChatInDB = await UserChatSchema.findOne({
      userUid: validUsers[1].uid,
    });

    const user3ChatInDB = await UserChatSchema.findOne({
      userUid: user3.uid,
    });

    expect(user1ChatInDB.chats.length).toBe(2);
    expect(user2ChatInDB.chats.length).toBe(1);
    expect(user3ChatInDB.chats.length).toBe(1);
  });
});
