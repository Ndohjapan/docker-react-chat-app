const app = require('../src/app');
const request = require('supertest');
const { UserSchema } = require('../src/models/User');
const en = require('../locale/en/translation');
const { UserChatSchema } = require('../src/models/UserChat');
const mongoose = require('mongoose');
const test = require('../config/test');
const dbConfig = test.database

let validUser;
const filter = ['displayName', 'email', 'photoURL', 'uid', '_id', '__v'];

beforeEach(async () => {
  await mongoose.connect(dbConfig.url+'/test1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  validUser = {
    displayName: 'Ndohjapan',
    email: 'ndohjoelmbj16@gmail.com',
    photoURL: 'Chibueze17',
    uid: '32ri329j9032uifm32',
  };
});

afterEach(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (error) {
    return true;
  }
});

const postUser = async (user = validUser) => {
  return request(app).post('/api/1.0/auth/user').send(user);
};

describe('Register a User to the database from Firebase', () => {
  it('return 200 when we send user is successfully created', async () => {
    const response = await postUser();
    expect(response.status).toBe(200);
  });

  it('return success message when user is successfully created', async () => {
    const response = await postUser();
    expect(response.body.message).toBe(en.user_created);
  });

  it('return error message', async () => {});

  it.each`
    field            | value   | message
    ${'displayName'} | ${null} | ${en.invalid_displayName}
    ${'email'}       | ${null} | ${en.invalid_email}
    ${'uid'}         | ${null} | ${en.invalid_uid}
    ${'photoURL'}    | ${null} | ${en.invalid_profile_url}
  `(
    'Returned $message when $field is $value',
    async ({ field, value, message }) => {
      const user = validUser;
      user[field] = value;
      const response = await postUser(user);
      expect(response.body.validationErrors[field]).toBe(message);
    }
  );

  it('returns 400 if you try to duplicate a user with same uid', async () => {
    await postUser();
    const response = await postUser();
    expect(response.status).toBe(400);
  });

  it('returns error message when we try to create a duplicate user with same uid', async () => {
    await postUser();
    const response = await postUser();
    expect(response.body.message).toBe(en.error_in_creating_user);
  });

  it('confirm that the duplicate was not mistakenly saved', async () => {
    await postUser();
    await postUser();
    await postUser();

    const userInDB = await UserSchema.find({});

    expect(userInDB.length).toBe(1);
  });

  it('confirm the new user is in the database after saving', async () => {
    await postUser();
    const userInDB = await UserSchema.find({});
    expect(userInDB[0].uid).toBe(validUser.uid);
  });

  it('return only the needed fields from the database', async () => {
    const response = await postUser();
    expect(Object.keys(response.body.data).length).toBe(filter.length);
    expect(Object.keys(response.body.data)).toEqual(
      expect.arrayContaining(filter)
    );
  });

  it('check if it created the user chat for both users', async () => {
    await postUser();
    const userChatInDB = await UserChatSchema.find({ userUid: validUser.uid });

    expect(userChatInDB.length).toBe(1);
  });

  it('check if the chats field is also empty after the chats documents are created', async () => {
    await postUser();
    const userChatInDB = await UserChatSchema.find({ userUid: validUser.uid });

    expect(userChatInDB[0].chats.length).toBe(0);
  });
});
