const request = require('supertest');
const app = require('../src/app');
const { UserSchema } = require('../src/models/User');
const en = require('../locales/en/transalation');
const { UserChatSchema } = require('../src/models/UserChat');
const mongoose = require('mongoose');

let validUsers = {
  displayName: 'Ndohjapan',
  email: 'ndohjoelmbj16@gmail.com',
  photoURL: 'Chibueze17',
  uid: '32ri329j9032uifm32',
};
// eslint-disable-next-line no-unused-vars
let user2 = {
  displayName: 'Ndohjapan3',
  email: 'ndohjoelmbj16@gmail.com',
  photoURL: 'Chibueze17',
  uid: '32ri329j9032u29y32ne',
};

beforeEach(async () => {
  await mongoose.connect('mongodb://localhost:27017/test4', {
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

const createUserandUserChat = async (users = validUsers) => {
  await UserSchema.create(users);
  let data = [{ userUid: users.uid }];
  await UserChatSchema.create(data);
  return true;
};

const getUserChat = async (uid) => {
  return await request(app).get(`/userChat/${uid}`).send();
};

describe('Get A Particular User from the UserChat Collection', () => {
  it('returns 404 when the uid is not in the database', async () => {
    const response = await getUserChat('fenwinfew');

    expect(response.status).toBe(404);
  });

  it('returns 404 response message user not found when the uid is not in the database', async () => {
    const response = await getUserChat('eiwnifewnew');

    expect(response.body.message).toBe(en.invalid_uid_for_user_chat);
  });

  it('returns 200 when there is a record in the database', async () => {
    await createUserandUserChat();

    const response = await getUserChat(validUsers.uid);

    expect(response.status).toBe(200);
  });

  it('returns body containing the userchat document', async () => {
    await createUserandUserChat();

    const response = await getUserChat(validUsers.uid);

    expect(response.body.userUid).toBe(validUsers.uid);
  });
});
